import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            component: () =>
                import ('@/views/home/index'),
            name: 'home',
            // meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
        }]
    }, ]
})