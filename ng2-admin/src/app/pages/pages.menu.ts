export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            //icon: 'ion-android-home',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'users',
        data: {
          menu: {
            title: 'Users',
            icon: 'ion-ios-people',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            path: 'overview',
            data: {
              menu: {
                title: 'Overview',
              }
            }
          },
          {
            path: 'manager',
            data: {
              menu: {
                title: 'Manager',
              }
            }
          }
        ]
      },
      {
        path: 'systems',
        data: {
          menu: {
            title: 'Systems',
            //icon: 'ion-android-home',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            path: 'add',
            data: {
              menu: {
                title: 'Add System',
              }
            }
          },
          {
            path: 'manager',
            data: {
              menu: {
                title: 'Systems Manager',
              }
            }
          },
          {
            path: 'shared-systems',
            data: {
              menu: {
                title: 'Shared Systems',
              }
            }
          },
        ]
      },
      {
        path: 'admin',
        data: {
          menu: {
            title: 'Admin',
            icon: 'ion-locked',
            selected: false,
            expanded: false,
            order: 0
          }
        },
        children: [
          {
            path: 'timesheets',
            data: {
              menu: {
                title: 'Timesheets',
                // icon: 'ion-clock',
              }
            }
          },
          {
            path: 'todo',
            data: {
              menu: {
                title: 'To Do List',
                // icon: 'ion-ios-list-outline'
              }
            }
          },
          {
            path: 'logs',
            data: {
              menu: {
                title: 'Logs',
                // icon: 'ion-ios-list-outline'
              }
            }
          },
        ]
      }
    ]
  }
];
