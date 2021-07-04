import {
  getIndexA,
  getStandardData,
  mock_double_horizontal_data,
  mock_double_vertical_data,
  mock_single_data,
  PanelRow,
} from './test.data';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  tableConfig = {
    single: {
      headers: [
        {
          key: 'row',
          title: 'Single Row',
        },
      ],
    },
    double: {
      headers: [
        {
          key: 'row',
          title: 'Double Vert Row',
        },
      ],
    },
  };
  tableHeight: number;
  dataBefore: any[] = [];
  dataAfter: any[] = [];

  singlePanelModel: PanelRow[][];
  doublePanelVertModel: PanelRow[][][];
  doublePanelHoriModel: PanelRow[][][];
  constructor() {}

  ngOnInit() {
    this.singlePanelModel = (
      getStandardData(
        void 0,
        void 0,
        void 0,
        mock_single_data,
        3,
        4,
        16
      ) as PanelRow[][]
    ).map((_) => _.map(this.singleMapHandler));
    // this.tableHeight = dBefore.length * 30 + 20;
    // this.dataBefore = dBefore;
    // this.dataAfter = dAfter;
    this.doublePanelVertModel = (
      getStandardData(
        void 0,
        'double',
        'vertical',
        mock_double_vertical_data,
        3,
        11,
        10
      ) as PanelRow[][][]
    ).map((_) =>
      _.map((__: PanelRow[], index: number) => {
        if (index === 0) {
          return __.map((___: PanelRow, index: number) =>
            this.doubleMapHandler(___, index)
          );
        } else if (index === 1) {
          return __.map((___: PanelRow, index: number) =>
            this.doubleMapHandler(___, index, _[0].length)
          );
        }
      })
    );
    this.doublePanelHoriModel = (
      getStandardData(
        void 0,
        'double',
        'horizontal',
        mock_double_horizontal_data,
        3,
        4,
        16
      ) as PanelRow[][][]
    ).map((_) =>
      _.map((__: PanelRow[], index: number) => {
        if (index === 0) {
          return __.map((___: PanelRow, index: number) =>
            this.doubleMapHandler(___, index, 1, 'hori')
          );
        } else if (index === 1) {
          return __.map((___: PanelRow, index: number) =>
            this.doubleMapHandler(___, index, 2, 'hori')
          );
        }
      })
    );
  }

  singleMapHandler = (input: PanelRow, index: number): PanelRow => {
    const { idx } = input;
    return {
      ...input,
      idx: idx === 0 ? index + 1 : idx,
    } as any;
  };

  doubleMapHandler = (
    input: PanelRow,
    index: number,
    base: number = 0,
    mode: 'hori' | 'vert' = 'vert'
  ): PanelRow => {
    const { idx } = input;
    if (mode === 'vert') {
      return {
        ...input,
        idx: idx === 0 ? index + base + 1 : idx,
      };
    } else {
      return {
        ...input,
        idx: index * 2 + base,
      };
    }
  };
}
