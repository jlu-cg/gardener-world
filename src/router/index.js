import Vue from 'vue'
import Router from 'vue-router'


import Index from '@/components/index'
import ViewDocumentDetail from '@/components/views/article/detail'

import AdminLogin from '@/components/admin/login'
import AdminIndex from '@/components/admin/index'
import AdminHome from '@/components/admin/home'
import AdminTagList from '@/components/admin/tag/list'
import AdminTagAdd from '@/components/admin/tag/add'
import AdminTagDetail from '@/components/admin/tag/detail'
import AdminArticleList from '@/components/admin/article/list'
import AdminArticleAdd from '@/components/admin/article/add'
import AdminArticleDetail from '@/components/admin/article/detail'
import AdminFragmentList from '@/components/admin/fragment/list'
import AdminFragmentAdd from '@/components/admin/fragment/add'


Vue.use(Router)

const routes = [
  {
    path:'/index',
    component:Index
  },
  {
    path:'/document/detail',
    component:ViewDocumentDetail
  },
  {
    path:'/admin',
    component:AdminIndex,
    children : [
      {
        path:'',
        component: AdminHome
      },
      {
        path:'login',
        component: AdminLogin
      },
      {
        path:'tag/add',
        component: AdminTagAdd
      },
      {
        path:'tag/list',
        component: AdminTagList
      },
      {
        path:'tag/detail',
        component: AdminTagDetail
      },
      {
        path:'article/list',
        component: AdminArticleList
      },
      {
        path:'article/detail',
        component: AdminArticleDetail
      },
      {
        path:'article/add',
        component: AdminArticleAdd
      },
      {
        path:'fragment/list',
        component: AdminFragmentList
      },
      {
        path:'fragment/add',
        component: AdminFragmentAdd
      }
    ]
  }
];

const router = new Router({
  routes
})

export default router;
