export const mockData = {
    copyright: '@Copyright 2017 Oct16',
    logo: 'assets/logo/logo.svg',
    panel: {
        building: {
            name: 'Building',
            count: 3
        },
        idle: {
            name: 'Idle',
            count: 5
        },
        detail: {
            all: {
                name: 'ALL',
                count: 8
            },
            physical: {
                name: 'PHYSICAL',
                count: 4
            },
            virtual: {
                name: 'VIRTUAL',
                count: 4
            }
        }
    },
    tabs: [
        {
            name: 'ALL',
            active: true
        },
        {
            name: 'Virtual',
            active: false
        },
        {
            name: 'Physical',
            active: false
        }
    ],
    navList: [
        {
            name: 'DASHBOARD',
            active: false,
            icon: 'icon-dashboard'
        },
        {
            name: 'AGENT',
            active: true,
            icon: 'icon-sitemap'
        },
        {
            name: 'MY CRUISE',
            active: false,
            icon: 'icon-boat'
        },
        {
            name: 'HELP',
            active: false,
            icon: 'icon-life-bouy'
        }
    ],
    histories: [
        'happyhacking03/Acceptance_test',
        'happyhacking04/Acceptance_test',
        'happyhacking05/Acceptance_test',
        'happyhacking06/Acceptance_test',
        'happyhacking07/Acceptance_test',
        'happyhacking08/Acceptance_test',
        'happyhacking09/Acceptance_test',
        'happyhacking10/Acceptance_test',
        'happyhacking11/Acceptance_test',
        'happyhacking12/Acceptance_test',
        'happyhacking13/Acceptance_test',
        'happyhacking14/Acceptance_test',
        'happyhacking15/Acceptance_test',
        'happyhacking16/Acceptance_test',
        'happyhacking17/Acceptance_test'
    ],
    agentList: [
        {
            icon: 'assets/os_icons/windows.png',
            title: 'happyhacking01.oct16.cn',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.125',
            status: 'idle',
            tags: [
                {
                    title: 'Firefox'
                },
                {
                    title: 'Safari'
                },
                {
                    title: 'Ubuntu'
                },
                {
                    title: 'Chrome'
                }
            ]
        },
        {
            icon: 'assets/os_icons/windows.png',
            title: 'happyhacking08.oct16.cn',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.182',
            status: 'building',
            tags: [
                {
                    title: 'Firefox'
                },
                {
                    title: 'Safari'
                },
                {
                    title: 'Ubuntu'
                },
                {
                    title: 'Chrome'
                }
            ]
        },
        {
            icon: 'assets/os_icons/ubuntu.png',
            title: 'happyhacking10.oct16.cn',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.62',
            status: 'building',
            tags: [
                {
                    title: 'Firefox'
                },
                {
                    title: 'Safari'
                }
            ]
        },
        {
            icon: 'assets/os_icons/debin.png',
            title: 'happyhacking11.oct16.cn',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.204',
            status: 'building',
            tags: []
        },
        {
            icon: 'assets/os_icons/suse.png',
            title: 'happyhacking.oct16.cn',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.132',
            status: 'idle',
            tags: [
                {
                    title: 'Firefox'
                },
                {
                    title: 'Safari'
                },
                {
                    title: 'Ubuntu'
                },
                {
                    title: 'Chrome'
                }
            ]
        },
        {
            icon: 'assets/os_icons/cent_os.png',
            title: 'happyhacking01.oct16.cn',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.112',
            status: 'idle',
            tags: [
                {
                    title: 'Firefox'
                },
                {
                    title: 'Safari'
                },
                {
                    title: 'Ubuntu'
                },
                {
                    title: 'Chrome'
                }
            ]
        }
    ]
}
