const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Home',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics'
        }
      ]
    },
    {
      id: 'utilities',
      title: 'Utilities',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'component',
          title: 'Master',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Category',
              type: 'item',
              url: '/master/category'
            },
            {
              id: 'badges',
              title: 'Subcategory',
              type: 'item',
              url: '/master/subcategory'
            },
            {
              id: 'breadcrumb-pagination',
              title: 'New Stock',
              type: 'item',
              url: '/master/stock'
            },
            {
              id: 'collapse',
              title: 'Rent',
              type: 'item',
              url: '/master/rent'
            },
            {
              id: 'typography',
              title: 'Deposit',
              type: 'item',
              url: '/master/deposit'
            },
            {
              id: 'custoomer',
              title: 'Customer',
              type: 'item',
              url: '/master/customer'
            },
          ]
        }
      ]
    },
    {
      id: 'menu',
      title: 'menu',
      type: 'group',
      icon: 'icon-ui',
      children: [
            {
              id: 'button',
              title: 'IN',
              type: 'item',
              icon: 'feather icon-log-in',
              url: '/rentals/in'
            },
            {
              id: 'badges',
              title: 'OUT',
              type: 'item',
              icon: 'feather icon-log-out',
              url: '/rentals/out'
            }
          ]
    },
    {
      id: 'auth',
      title: 'Authentication',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'sign in',
          title: 'Login',
          type: 'item',
          icon: 'feather icon-lock',
          url: '/auth/signin-1',
          target: true,
          breadcrumbs: false
        },
        // {
        //   id: 'sign Up',
        //   title: 'Register',
        //   type: 'item',
        //   icon: 'feather icon-log-in',
        //   url: '/auth/signup-1',
        //   target: true,
        //   breadcrumbs: false
        // },
        // {
        //   id: 'reset-pass',
        //   title: 'Reset Password',
        //   type: 'item',
        //   icon: 'feather icon-unlock',
        //   url: '/auth/reset-password-1',
        //   target: true,
        //   breadcrumbs: false
        // }
      ]
    },
    // {
    //   id: 'support',
    //   title: 'Support',
    //   type: 'group',
    //   icon: 'icon-support',
    //   children: [
    //     {
    //       id: 'sample-page',
    //       title: 'Sample Page',
    //       type: 'item',
    //       url: '/sample-page',
    //       classes: 'nav-item',
    //       icon: 'feather icon-sidebar'
    //     },
    //     {
    //       id: 'documentation',
    //       title: 'Documentation',
    //       type: 'item',
    //       icon: 'feather icon-help-circle',
    //       classes: 'nav-item',
    //       url: 'https://codedthemes.gitbook.io/gradient-able-react/',
    //       target: true,
    //       external: true
    //     }
    //   ]
    // },
   
  ]
};

export default menuItems;
