import { MOCK_DATA } from './data/data';
import { transformData } from './utils';
import { registerCustomLayout } from './layout/custom.layout';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import G6 from '@antv/g6';
import { registerDeviceNode } from './node/device.node';
import { registerCableEdge } from './edge/cable.edge';

@Component({
  selector: 'app-fiber-doc-view',
  templateUrl: './fiber-doc-view.component.html',
  styleUrls: ['./fiber-doc-view.component.scss'],
})
export class FiberDocViewComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    registerCustomLayout();
    registerCableEdge();
    registerDeviceNode();
    const container = document.getElementById('container');
    const width = container.scrollWidth || 1200;
    const margin = 100;
    const nodesWidth = width - 2 * margin;

    const height = container.scrollHeight;

    const graph = new G6.Graph({
      container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      // width: 800, // Number，必须，图的宽度
      // height: 500, // Number，必须，图的高度
      width,
      height,
      renderer: 'svg',
      layout: {
        type: 'd13n-layout',
        width,
        height,
        center: [0, 0],
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        type: 'd13n-node',
      },
      defaultEdge: {
        type: 'cable-edge',
      },
    });
    graph.data(transformData(MOCK_DATA));
    graph.render();
    graph.zoomTo(0.8);
  }

  ngOnInit() {}
}
