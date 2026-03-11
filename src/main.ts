/**
 * 應用程式入口點
 * 負責初始化 Vue 應用程式，並註冊 Pinia 狀態管理與 Vue Router 路由
 */
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
