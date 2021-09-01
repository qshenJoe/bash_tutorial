import { registerCustomLayout } from './layout/custom.layout';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import G6 from '@antv/g6';
import { registerDeviceNode } from './nodes/device.node';
import { registerCableEdge } from './edges/cable.edge';
import { transformData } from './utils';
import { combineLatest, merge, ReplaySubject, Subject } from 'rxjs';
import { IconService } from '@ngux/component/icon';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FiberDocViewService } from './fiber-doc-view.service';
import { ActivatedRoute } from '@angular/router';
import { DefaultBTDetailToolbar } from '@ngux/shared/table';
import { BasicToolbarMenuTypeEnum } from '@ngux/shared/toolbar/basic-toolbar';

@Component({
  selector: 'ux-fiber-doc-view',
  templateUrl: './fiber-doc-view.component.html',
  styleUrls: ['./fiber-doc-view.component.scss'],
})
export class FiberDocViewComponent implements OnInit, AfterViewInit, OnDestroy {
  destroyed$$ = new Subject<void>();
  private data$$ = new ReplaySubject<any[]>(1);
  graph: any;

  toolbar = new DefaultBTDetailToolbar({
    hostKey: 'path-view.info',
    // accessKey: AclModuleKeys.PATH_VIEW;
    menus: {
      [BasicToolbarMenuTypeEnum.EXPORT]: {
        keys: ['xlsx'], //  'pdf'
      },
      [BasicToolbarMenuTypeEnum.REFRESH_LIST]: {},
      [BasicToolbarMenuTypeEnum.NEW_FAVORITE]: {},
    },
  });

  @Input() set data(value: any) {
    if (value == null) {
      return;
    }
    this.data$$.next(value);
  }

  constructor(
    public service: FiberDocViewService,
    private router: ActivatedRoute,
    private iconService: IconService
  ) {}

  ngAfterViewInit(): void {
    // registerCustomLayout();
    // registerCableEdge();
    // registerDeviceNode();
    this.init();
    // const container = document.getElementById('container');
    // const width = container.scrollWidth || 1200;
    // const height = container.scrollHeight;
    // const margin = 100;
    // const nodesWidth = width - 2 * margin;

    // const d = [
    //   {
    //     id: 0,
    //     pid: 1,
    //     entityId: 28305,
    //     entityName: 'jer-fiber-pp(1)(5)',
    //     entityType: 'device',
    //     fromPort: null,
    //     toPort: 'SC 10',
    //     location: null,
    //     container: '',
    //     modelId: '7afc9c00-b8a3-11e3-aa5a-005056000016',
    //     typeName: 'Fiber - Patch Panel',
    //     color: null,
    //     length: null,
    //   },
    //   {
    //     id: 1,
    //     pid: 2,
    //     entityId: 1376,
    //     entityName:
    //       '0831-lori-fiber-duplex(1) : LC_1 to jer-fiber-pp(1)(5) : SC 10',
    //     entityType: 'cable',
    //     fromPort: null,
    //     toPort: null,
    //     location: null,
    //     container: null,
    //     modelId: null,
    //     typeName: 'Fiber Patch Cord, Fan Out, LC, 12 Strands',
    //     color: '#0062B1',
    //     length: null,
    //   },
    //   {
    //     id: 2,
    //     pid: 3,
    //     entityId: 28491,
    //     entityName: '0831-lori-fiber-duplex(1)',
    //     entityType: 'device',
    //     fromPort: 'LC_1[A]',
    //     toPort: 'MTP_1',
    //     location: null,
    //     container: '',
    //     modelId: 'da136aa1-6fec-5dfe-a8e2-260205355055',
    //     typeName: 'Fiber - Cassette',
    //     color: null,
    //     length: null,
    //   },
    //   {
    //     id: 3,
    //     pid: 4,
    //     entityId: 1375,
    //     entityName: '0831-lori-fiber-duplex(1) : MTP_1 to jer-fiber-pp : FC 02',
    //     entityType: 'cable',
    //     fromPort: null,
    //     toPort: null,
    //     location: null,
    //     container: null,
    //     modelId: null,
    //     typeName: 'Fiber Patch Cord, Fan Out, LC, 12 Strands',
    //     color: '#0062B1',
    //     length: null,
    //   },
    //   {
    //     id: 4,
    //     pid: 5,
    //     entityId: 22940,
    //     entityName: 'jer-fiber-pp',
    //     entityType: 'device',
    //     fromPort: 'FC 02',
    //     toPort: 'FC 02[Back]',
    //     location: null,
    //     container: '',
    //     modelId: '7afc9c00-b8a3-11e3-aa5a-005056000016',
    //     typeName: 'Fiber - Patch Panel',
    //     color: null,
    //     length: null,
    //   },
    //   {
    //     id: 5,
    //     pid: 6,
    //     entityId: 1374,
    //     entityName:
    //       '0831-lori-fiber-duplex : LC_1 to jer-fiber-pp : FC 02[Back]',
    //     entityType: 'cable',
    //     fromPort: null,
    //     toPort: null,
    //     location: null,
    //     container: null,
    //     modelId: null,
    //     typeName: 'Fiber Patch Cord, Fan Out, LC, 12 Strands',
    //     color: '#0062B1',
    //     length: null,
    //   },
    //   {
    //     id: 6,
    //     pid: 7,
    //     entityId: 28490,
    //     entityName: '0831-lori-fiber-duplex',
    //     entityType: 'device',
    //     fromPort: 'LC_1[A]',
    //     toPort: 'MTP_1',
    //     location: null,
    //     container: '',
    //     modelId: 'da136aa1-6fec-5dfe-a8e2-260205355055',
    //     typeName: 'Fiber - Cassette',
    //     color: null,
    //     length: null,
    //   },
    //   {
    //     id: 7,
    //     pid: 8,
    //     entityId: 1373,
    //     entityName:
    //       'Cassette Splitter_case1-001 : SC0 1 to 0831-lori-fiber-duplex : MTP_1',
    //     entityType: 'cable',
    //     fromPort: null,
    //     toPort: null,
    //     location: null,
    //     container: null,
    //     modelId: null,
    //     typeName: 'Fiber Patch Cord, Fan Out, LC, 12 Strands',
    //     color: '#0062B1',
    //     length: null,
    //   },
    //   {
    //     id: 8,
    //     pid: 9,
    //     entityId: 22626,
    //     entityName: 'Cassette Splitter_case1-001',
    //     entityType: 'device',
    //     fromPort: 'SC0 1',
    //     toPort: 'SC-IN',
    //     location: null,
    //     container: '',
    //     modelId: '56e99ef4-d72f-4ccd-84ce-c28891aba5cd',
    //     typeName: 'Fiber - Cassette',
    //     color: null,
    //     length: null,
    //   },
    //   {
    //     id: 9,
    //     pid: 10,
    //     entityId: 313151170203878647,
    //     entityName: 'Cable2-00-013',
    //     entityType: 'cable',
    //     fromPort: 'core-01',
    //     toPort: null,
    //     location: null,
    //     container: null,
    //     modelId: null,
    //     typeName: 'Optical Fibre Cable',
    //     color: '#FF000000',
    //     length: 65.6,
    //   },
    //   {
    //     id: 10,
    //     pid: 11,
    //     entityId: 22826,
    //     entityName: 'JunctionBox-jeremy-001',
    //     entityType: 'device',
    //     fromPort: 'Hole 01',
    //     toPort: 'Hole 02',
    //     location: null,
    //     container: '',
    //     modelId: 'bbd18c12-bc59-4691-b676-92a7bfb85415',
    //     typeName: 'Fiber - Junction Box',
    //     color: null,
    //     length: null,
    //   },
    //   {
    //     id: 11,
    //     pid: 12,
    //     entityId: 313151170203878647,
    //     entityName: 'Cable2-00-013',
    //     entityType: 'cable',
    //     fromPort: 'core-01',
    //     toPort: null,
    //     location: null,
    //     container: null,
    //     modelId: null,
    //     typeName: 'Optical Fibre Cable',
    //     color: '#FF000000',
    //     length: 65.6,
    //   },
    // ];

    // const graph = new G6.Graph({
    //   container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    //   // width: 800, // Number，必须，图的宽度
    //   // height: 500, // Number，必须，图的高度
    //   width,
    //   height,
    //   renderer: 'svg',
    //   fitView: true,
    //   layout: {
    //     type: 'd13n-layout',
    //     width,
    //     height,
    //     center: [0, 0],
    //   },
    //   modes: {
    //     default: ['drag-canvas', 'zoom-canvas'],
    //   },
    //   defaultNode: {
    //     type: 'd13n-node',
    //   },
    //   defaultEdge: {
    //     type: 'cable-edge',
    //   },
    // });
    // graph.data(transformData(d));
    // graph.render();
    // graph.zoomTo(0.8);
  }

  ngOnInit() {
    this.service.dataSource$$.pipe(this.autoDestroyed()).subscribe(result => {
      this.setData(result);
    });
    this.router.data.pipe(this.autoDestroyed()).subscribe(result => {});
  }

  setData(data: any) {
    this.data = transformData(data);
  }

  init() {
    combineLatest([this.data$$, this.iconService.loadingCompleted$$])
      .pipe(debounceTime(100), this.autoDestroyed())
      .subscribe(([data]) => {
        if (this.graph != null) {
          // && preType !== type
          this.graph.destroy();
          this.graph = null;
        }
        if (this.graph == null) {
          const container = document.getElementById('container');
          const width = container.scrollWidth || 1200;
          const height = container.scrollHeight;
          this.graph = new G6.Graph({
            container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
            // width: 800, // Number，必须，图的宽度
            // height: 500, // Number，必须，图的高度
            width,
            height,
            renderer: 'svg',
            fitView: true,
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
          this.graph.data(data);
          this.graph.render();
          this.graph.zoomTo(0.8);
        } else {
          this.graph.changeData(data);
        }
      });
  }

  autoDestroyed<T>(...obs: Subject<any>[]) {
    return obs && obs.length > 0
      ? takeUntil<T>(merge(...obs, this.destroyed$$))
      : takeUntil<T>(this.destroyed$$);
  }

  ngOnDestroy() {
    this.destroyed$$.next();
    this.destroyed$$.unsubscribe();
    this.service.dataSource$$.next(null);
  }
}
