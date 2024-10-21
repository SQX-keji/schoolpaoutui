import Vue from 'vue'
import App from './App'
import HttpRequestYu from '@/common/httpRequestYU'
import HttpRequest from './common/httpRequest'
import HttpCache from './common/cache'
import queue from './common/queue'

// 组件按需引入
import tuiSteps from '@/components/tui-steps/tui-steps';
Vue.component('tui-steps', tuiSteps);
import tuiIcon from '@/components/tui-icon/tui-icon';
Vue.component('tui-icon', tuiIcon);
import tuiDatetime from '@/components/tui-datetime/tui-datetime';
Vue.component('tui-datetime', tuiDatetime);
import getCode from '@/components/get-code'
Vue.component('getCode', getCode);
import empty from '@/components/empty';
Vue.component('empty', empty);
import loadMore from '@/components/load-more';
Vue.component('load-more', loadMore);
import tuinoData from '@/components/tui-no-data/tui-no-data';
Vue.component('tui-no-data', tuinoData);


import 'js_sdk/ican-H5Api/ican-H5Api'
import share from './common/share.js'
Vue.config.productionTip = false
Vue.prototype.$Request = HttpRequest;
Vue.prototype.$queue = queue;

Vue.prototype.$Sysconf = HttpRequest.config;
Vue.prototype.$SysCache = HttpCache;
Vue.prototype.yu = HttpRequestYu;
Vue.mixin(share)
App.mpType = 'app';


const app = new Vue({
    ...App
});
app.$mount();
