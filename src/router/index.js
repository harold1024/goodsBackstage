import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// import Layout from '@/layout'

export default new Router({
    routes: [
        // {
        //       path: '/redirect',
        //       component: Layout,
        //       hidden: true,
        //       children: [{
        //           path: '/redirect/:path(.*)',
        //           component: () =>
        //               import ('@/views/redirect/index')
        //       }]
        //   },
        {
            path: '/',
            // component: Layout,
            redirect: '/home',
            children: [{
                path: 'home',
                component: () =>
                    import ('@/views/home/index'),
                name: 'Home',
                // meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
            }]
        },
    ]
})