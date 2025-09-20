import { PackagingRepository } from '../../domain/repositories/packaging.repository';
import { Order } from '../../domain/entities/order.entity';
import { BOXES } from './box-catalog.adapter';
import { Product } from '../../domain/entities/product.entity';
import { Box } from '../../domain/entities/box.entity';
import { Dimensions } from '../../domain/entities/dimensions';
import { Inject, Injectable } from '@nestjs/common';
import { PACKING_POLICY, PackingPolicy } from '../policies/packing.policy';

type Axis = 'h' | 'w' | 'd';
type Triplet = { h: number; w: number; d: number };

@Injectable()
export class InMemoryPackagingRepository implements PackagingRepository {
  constructor(
    @Inject(PACKING_POLICY) private readonly policy: PackingPolicy
  ) {}

  pack(
    order: Order,
  ): { caixa_id: string | null; produtos: string[]; observacao?: string }[] {
    const availableBoxes = BOXES.slice().sort(
      (a, b) => a.volume() - b.volume(),
    );
    const itemsToPack = order.produtos
      .slice()
      .sort((a, b) => b.volume() - a.volume());

    type Packed = { box: Box | null; products: Product[]; frozenAxis?: Axis };
    const packedBoxes: Packed[] = [];

    for (const item of itemsToPack) {
      const itemTrip = this.toTriplet(item.dimensoes);

      const fitsAnyIndividually = availableBoxes.some((bx) =>
        this.fits(item.dimensoes, bx.dimensoes),
      );
      if (!fitsAnyIndividually) {
        packedBoxes.push({ box: null, products: [item] });
        continue;
      }

      let bestExisting: { idx: number; waste: number } | null = null;

      for (let i = 0; i < packedBoxes.length; i++) {
        const pk = packedBoxes[i];
        if (!pk.box) continue;

        const pkTrips = pk.products.map((p) => this.toTriplet(p.dimensoes));
        const hasBig = pkTrips.some(this.isBig.bind(this));
        if (hasBig && pk.products.length >= this.policy.maxWithBig) continue;

        const bxTrip = this.toTriplet(pk.box.dimensoes);

        if (!pk.frozenAxis) {
          pk.frozenAxis = this.chooseInitialAxis(bxTrip, pkTrips[0]);
        }

        const wouldExceed =
          (hasBig || this.isBig(itemTrip)) &&
          pk.products.length + 1 > this.policy.maxWithBig;
        if (wouldExceed) continue;

        const w = this.tryAppendOnFrozenAxis(
          bxTrip,
          pkTrips,
          [itemTrip],
          pk.frozenAxis!,
        );
        if (w === null) continue;
        if (!bestExisting || w < bestExisting.waste)
          bestExisting = { idx: i, waste: w };
      }

      if (bestExisting) {
        packedBoxes[bestExisting.idx].products.push(item);
        continue;
      }

      let bestNew: { box: Box; frozenAxis: Axis; waste: number } | null = null;

      for (const newBox of availableBoxes) {
        if (!this.fits(item.dimensoes, newBox.dimensoes)) continue;

        const bxTrip = this.toTriplet(newBox.dimensoes);
        const axis = this.chooseInitialAxis(bxTrip, itemTrip);
        if (!this.fitsShelfOnAxis(bxTrip, [itemTrip], axis)) continue;

        const w = this.wasteOnAxis(bxTrip, [itemTrip], axis);
        if (!bestNew || w < bestNew.waste)
          bestNew = { box: newBox, frozenAxis: axis, waste: w };
      }

      if (bestNew) {
        packedBoxes.push({
          box: bestNew.box,
          products: [item],
          frozenAxis: bestNew.frozenAxis,
        });
        continue;
      }

      packedBoxes.push({ box: null, products: [item] });
    }

    return packedBoxes.map((p) =>
      p.box
        ? {
            caixa_id: p.box.caixa_id,
            produtos: p.products.map((x) => x.produto_id),
          }
        : {
            caixa_id: null,
            produtos: p.products.map((x) => x.produto_id),
            observacao: 'Produto não cabe em nenhuma caixa disponível.',
          },
    );
  }

  private toTriplet(d: Dimensions): Triplet {
    return { h: d.altura, w: d.largura, d: d.comprimento };
  }

  private isBig(t: Triplet): boolean {
    return t.h >= this.policy.bigH || t.w >= this.policy.bigW;
  }

  private fitsShelfOnAxis(box: Triplet, items: Triplet[], axis: Axis): boolean {
    if (axis === 'd') {
      const sum = items.reduce((a, it) => a + it.d, 0);
      const maxH = Math.max(...items.map((it) => it.h));
      const maxW = Math.max(...items.map((it) => it.w));
      return sum <= box.d && maxH <= box.h && maxW <= box.w;
    }
    if (axis === 'w') {
      const sum = items.reduce((a, it) => a + it.w, 0);
      const maxH = Math.max(...items.map((it) => it.h));
      const maxD = Math.max(...items.map((it) => it.d));
      return sum <= box.w && maxH <= box.h && maxD <= box.d;
    }
    const sum = items.reduce((a, it) => a + it.h, 0);
    const maxW = Math.max(...items.map((it) => it.w));
    const maxD = Math.max(...items.map((it) => it.d));
    return sum <= box.h && maxW <= box.w && maxD <= box.d;
  }

  private wasteOnAxis(box: Triplet, items: Triplet[], axis: Axis): number {
    if (axis === 'd') {
      const sum = items.reduce((a, it) => a + it.d, 0);
      return box.d - sum;
    }
    if (axis === 'w') {
      const sum = items.reduce((a, it) => a + it.w, 0);
      return box.w - sum;
    }
    const sum = items.reduce((a, it) => a + it.h, 0);
    return box.h - sum;
  }

  private chooseInitialAxis(box: Triplet, firstItem: Triplet): Axis {
    const candidates: Axis[] = ['d', 'w', 'h'];
    const feasible = candidates.filter((ax) =>
      this.fitsShelfOnAxis(box, [firstItem], ax),
    );
    if (!feasible.length) return 'd';
    let best: { axis: Axis; waste: number } | null = null;
    for (const ax of feasible) {
      const w = this.wasteOnAxis(box, [firstItem], ax);
      if (!best || w > best.waste) best = { axis: ax, waste: w };
    }
    return best!.axis;
  }

  private tryAppendOnFrozenAxis(
    box: Triplet,
    currentItems: Triplet[],
    nextItem: Triplet[],
    axis: Axis,
  ): number | null {
    const candidate = [...currentItems, ...nextItem];
    if (!this.fitsShelfOnAxis(box, candidate, axis)) return null;
    return this.wasteOnAxis(box, candidate, axis);
  }

  private fits(item: Dimensions, box: Dimensions): boolean {
    const itemDims = [item.altura, item.largura, item.comprimento].sort(
      (a, b) => a - b,
    );
    const boxDims = [box.altura, box.largura, box.comprimento].sort(
      (a, b) => a - b,
    );
    return (
      itemDims[0] <= boxDims[0] &&
      itemDims[1] <= boxDims[1] &&
      itemDims[2] <= boxDims[2]
    );
  }
}
