import { registerCustomLayout } from './layout/custom.layout';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  Input,
  ElementRef,
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
import { TRANSLATE } from '@ngux/util';
import { MOCK_DATA } from '@ngux/shared/fiber-doc-view/data';
import { CustomBaseEvent, nextTick } from '@opi/util';
import { GlobalService } from '@opi/abc';

@Component({
  selector: 'ux-fiber-doc-view',
  templateUrl: './fiber-doc-view.component.html',
  styleUrls: ['./fiber-doc-view.component.scss'],
})
export class FiberDocViewComponent implements OnInit, AfterViewInit, OnDestroy {
  destroyed$$ = new Subject<void>();
  private data$$ = new ReplaySubject<any[]>(1);
  graph: any;
  portOptionLabel: string;
  portOptionType: 'simplex' | 'duplex' | 'mtp';
  duplexPositionData: any[];
  mtpStrandData: any[];
  selectedStrand: number = 1;

  toolbar = new DefaultBTDetailToolbar({
    hostKey: 'path-view.info',
    title: TRANSLATE('common.circuit_trace') as any,
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

  get nativeElement() {
    return this.elementRef.nativeElement;
  }

  constructor(
    public service: FiberDocViewService,
    private router: ActivatedRoute,
    private iconService: IconService,
    private elementRef: ElementRef,
    private globalService: GlobalService
  ) {}

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnInit() {
    this.service.dataSource$$.pipe(this.autoDestroyed()).subscribe(result => {
      this.setData(result);
    });
    this.router.data.pipe(this.autoDestroyed()).subscribe(result => {});
    this.service.portIdxSource$$
      .pipe(this.autoDestroyed())
      .subscribe(result => {
        this.loadButtons(result);
        console.log(result);
      });

    combineLatest([
      this.globalService.resize$,
      this.globalService.mainSideNavStatus$$,
      this.globalService.deviceCentralLeftStatus$$,
      this.globalService.deviceCentralTileStatus$$,
    ])
      .pipe(debounceTime(120), this.autoDestroyed())
      .subscribe(() => {
        nextTick(() => {
          if (this.graph && this.nativeElement) {
            this.graph.changeSize(
              this.nativeElement.offsetWidth,
              this.nativeElement.offsetHeight
            );
          }
        }, 500);
      });
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
          const width = this.nativeElement.offsetWidth;
          const height = this.nativeElement.offsetHeight - 60;
          const container = document.getElementById('container');
          // const width = container.scrollWidth || 1200;
          // const height = container.scrollHeight;
          this.graph = new G6.Graph({
            container: this.nativeElement, //  'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
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
          // this.graph.data(transformData(MOCK_DATA));
          this.graph.data(data);
          this.graph.render();
          this.graph.zoomTo(0.8);
        } else {
          this.graph.changeData(data);
        }
      });
  }

  loadButtons(config: {
    type: string;
    list?: { key: string; value: number }[];
  }) {
    const { type, list } = config;
    if (type === 'simple') {
      // hide buttons
      this.portOptionLabel = null;
      this.portOptionType = 'simplex';
    } else if (type === 'duplex') {
      this.duplexPositionData = list.map((item: any) => {
        const { value, key } = item;
        return {
          label: value,
          id: key,
          name: 'duplex-position-radio',
        };
      });
      this.portOptionLabel = 'Duplex Position';
      this.portOptionType = 'duplex';
    } else if (type === 'mtp') {
      this.mtpStrandData = list;
      this.portOptionLabel = 'Strand';
      this.portOptionType = 'mtp';
    }
  }

  handlerChangePortIdxEvent(event: CustomBaseEvent, type: 'duplex' | 'mtp') {
    const { value } = event;
    if (type === 'duplex') {
      this.service.refresh({ idx: value });
    } else if (type === 'mtp') {
      this.selectedStrand = value;
      this.service.refresh({ idx: value });
    }
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
    this.service.portIdxSource$$.next(null);
  }
}
