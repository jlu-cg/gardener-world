import Vue from 'vue'
import Router from 'vue-router'


import Index from '@/components/views/index'
import ViewArticleDetail from '@/components/views/article/detail'

import AdminLogin from '@/components/admin/login'
import AdminIndex from '@/components/admin/index'
import AdminHome from '@/components/admin/home'
import AdminTagList from '@/components/admin/tag/list'
import AdminTagAdd from '@/components/admin/tag/add'
import AdminTagDetail from '@/components/admin/tag/detail'

import AdminEnvironmentLabelList from '@/components/admin/environment/list'
import AdminEnvironmentLabelAdd from '@/components/admin/environment/add'

import AdminDetailIntroductionList from '@/components/admin/introduction/list'
import AdminDetailIntroductionAdd from '@/components/admin/introduction/add'
import AdminDetailIntroductionDetail from '@/components/admin/introduction/detail'

import AdminArticleList from '@/components/admin/article/list'
import AdminArticleAdd from '@/components/admin/article/add'
import AdminArticleDetail from '@/components/admin/article/detail'

import AdminFragmentList from '@/components/admin/fragment/list'
import AdminFragmentDetail from '@/components/admin/fragment/detail'
import AdminFragmentAdd from '@/components/admin/fragment/add'

import AdminQuestionList from '@/components/admin/question/list'
import AdminQuestionAdd from '@/components/admin/question/add'
import AdminQuestionDetail from '@/components/admin/question/detail'

import AdminQuestionSolutionList from '@/components/admin/question/solution/list'
import AdminQuestionSolutionAdd from '@/components/admin/question/solution/add'

Vue.use(Router)

const routes = [
  {
    path:'',
    component:Index
  },
  {
    path:'/article/detail',
    component:ViewArticleDetail
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
        path:'tag/list',
        component: AdminTagList
      },
      {
        path:'tag/add',
        component: AdminTagAdd
      },
      {
        path:'tag/detail',
        component: AdminTagDetail
      },
      {
        path:'environment/label/list',
        component: AdminEnvironmentLabelList
      },
      {
        path:'environment/label/add',
        component: AdminEnvironmentLabelAdd
      },
      {
        path:'detail/introduction/list',
        component: AdminDetailIntroductionList
      },
      {
        path:'detail/introduction/add',
        component: AdminDetailIntroductionAdd
      },
      {
        path:'detail/introduction/detail',
        component: AdminDetailIntroductionDetail
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
      },
      {
        path:'fragment/detail',
        component: AdminFragmentDetail
      },
      {
        path:'question/list',
        component: AdminQuestionList
      },
      {
        path:'question/add',
        component: AdminQuestionAdd
      },
      {
        path:'question/detail',
        component: AdminQuestionDetail
      },
      {
        path:'question/solution/list',
        component: AdminQuestionSolutionList
      },
      {
        path:'question/solution/add',
        component: AdminQuestionSolutionAdd
      }
    ]
  }
];

const router = new Router({
  routes
})

export default router;
