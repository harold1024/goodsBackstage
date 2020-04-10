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
        },
        {
            path: '/',
            component: Layout,
            redirect: '/goods/goods',
            name: 'goods',
            meta: {
                title: 'goods',
                icon: 'excel'
            },
            children: [{
                    path: 'goods',
                    component: () =>
                        import ('@/views/goods/goods'),
                    name: 'goods',
                    meta: { title: 'goods' }
                },
                {
                    path: 'goodsList',
                    component: () =>
                        import ('@/views/goods/goodsList'),
                    name: 'goodsList',
                    meta: { title: 'goodsList' }
                }
            ]
        },
    ]
})