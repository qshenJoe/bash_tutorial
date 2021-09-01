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
    const data = {
      // 点集
      nodes: [
        {
          id: 'node1',
          title: 'Junction Box 1',
          uposition: 'Rack test U 11 Slot 9',
          sPort: 'PORT - L',
          dPort: 'PORT - R',
          anchorPoints: [[1, 250 / 300]],
          deviceType: 'Core Switch-A',
        },
        {
          id: 'node2',
          title: 'Junction Box 2',
          uposition: 'Rack test U 25 Slot 4',
          sPort: 'PORT - L',
          dPort: 'PORT - R',
          anchorPoints: [
            [0, 250 / 300],
            [1, 250 / 300],
          ],
          deviceType: 'PatchPanel#1',
        },
        {
          id: 'node3',
          title: 'Junction Box 3',
          uposition: 'Rack test U 3 Slot 19',
          sPort: 'PORT - L',
          dPort: 'PORT - R',
          anchorPoints: [
            [0, 250 / 300],
            [1, 250 / 300],
          ],
          deviceType: 'PatchPanel#2',
        },
        {
          id: 'node4',
          title: 'Junction Box 4',
          uposition: 'Rack test U 5 Slot 14',
          sPort: 'PORT - L',
          dPort: 'PORT - R',
          anchorPoints: [
            [0, 250 / 300],
            [1, 250 / 300],
          ],
          deviceType: 'PatchPanel#3',
        },
        {
          id: 'node5',
          title: 'Junction Box 4',
          uposition: 'Rack test U 5 Slot 14',
          sPort: 'PORT - L',
          dPort: 'PORT - R',
          anchorPoints: [
            [0, 250 / 300],
            [1, 250 / 300],
          ],
          deviceType: 'PatchPanel#3',
        },
        {
          id: 'node6',
          title: 'Junction Box 4',
          uposition: 'Rack test U 5 Slot 14',
          sPort: 'PORT - L',
          dPort: 'PORT - R',
          anchorPoints: [
            [0, 250 / 300],
            [1, 250 / 300],
          ],
          deviceType: 'PatchPanel#3',
        },
      ],
      // 边集
      edges: [
        // 表示一条从 node1 节点连接到 node2 节点的边
        {
          source: 'node1',
          target: 'node2',
          sourceAnchor: 0,
          targetAnchor: 0,
          style: {
            lineWidth: 10,
            startArrow: {
              path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
              stroke: '#F6BD16',
            },
            endArrow: {
              path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
              stroke: '#F6BD16',
            },
          },
          label: 'cable info sample',
          labelCfg: {
            refY: 50,
          },
          info: `Name: Fiber#3\nType: Fiber Cable\nLength: 10ft`,
        },
        {
          source: 'node2',
          target: 'node3',
          sourceAnchor: 1,
          targetAnchor: 0,
          style: {
            lineWidth: 10,
            startArrow: {
              path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
              stroke: '#F6BD16',
            },
            endArrow: {
              path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
              stroke: '#F6BD16',
            },
          },
          label: 'cable info sample',
          labelCfg: {
            refY: 50,
          },
        },
        {
          source: 'node3',
          target: 'node4',
          sourceAnchor: 1,
          targetAnchor: 1,
          direction: 'RDL',
          style: {
            lineWidth: 10,
            startArrow: {
              path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
              stroke: '#F6BD16',
            },
            endArrow: {
              path: 'M 0,-5 L 0,5 L 30,5 L 30,-5 Z',
              stroke: '#F6BD16',
            },
          },
          label: 'cable info sample',
          labelCfg: {
            refY: 50,
          },
        },
      ],
    };

    const graph = new G6.Graph({
      container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      // width: 800, // Number，必须，图的宽度
      // height: 500, // Number，必须，图的高度
      width,
      height,
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
    graph.data(data);
    graph.render();
    graph.zoomTo(0.8);
  }

  ngOnInit() {}
}
