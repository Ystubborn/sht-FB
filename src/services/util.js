
import injector from 'vue-inject';
import authService from './authservice';
import ops from '../lib/domain/opservice/xoputil';
import axios from './axios';
import urlResolver from './urlResolver';

injector.constant('authService',authService);
injector.constant('axios',axios);
injector.constant('urlResolver',urlResolver);

injector.service('ops',[
	'urlResolver',
	'axios',
],ops);
