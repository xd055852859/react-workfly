import Loadable from 'react-loadable';

let config= [
  {
    name: '任务',
    path: '/task',
    exact: true,
    component: Loadable({
      loader: () => import('../views/content/content'),
      loading: () => null,
    }),
  },
  // {
  //   name: "内容",
  //   path: "/test",
  //   exact: false,
  //   component: Loadable({
  //     loader: () => import("../views/groupTable/test"),
  //     loading: () => null,
  //   }),
  // }
];

export default config;
