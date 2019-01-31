export const mockData = {
    test: 'assets/logo/logo.svg',
    panel: {
        building: {
            name: 'Building',
            count: '3'
        },
        Idle: {
            name: 'Idle',
            count: '5'
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
            name: 'Physical',
            active: true
        },
        {
            name: 'Virtual',
            active: true
        }
    ],
    list: {
        agent1: {
            icon: 'assets/os_icons/windows.png'
        }
    },
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

    testList: [
        {
            icon: 'assets/os_icons/windows.png',
            title: 'bjstdmngbg01.thoughtworks.com',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.125',
            status: 'idle',
            tags: ['windows', 'ubuntu']
        },
        {
            icon: 'assets/os_icons/windows.png',
            title: 'bjstdmngbg08.thoughtworks.com',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.182',
            status: 'building',
            tags: ['windows', 'ubuntu']
        },
        {
            icon: 'assets/os_icons/ubuntu.png',
            title: 'bjstdmngbg10.thoughtworks.com',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.62',
            status: 'building',
            tags: ['windows', 'ubuntu']
        },
        {
            icon: 'assets/os_icons/debin.png',
            title: 'bjstdmngbg11.thoughtworks.com',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.204',
            status: 'building',
            tags: ['windows', 'ubuntu']
        },
        {
            icon: 'assets/os_icons/suse.png',
            title: 'bjstdmngbg.thoughtworks.com',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.132',
            status: 'idle',
            tags: ['windows', 'ubuntu']
        },
        {
            icon: 'assets/os_icons/cent_os.png',
            title: 'bjstdmngbg01.thoughtworks.com',
            folderName: '/var/lib/cruise-agent',
            ip: '192.168.1.112',
            status: 'idle',
            tags: ['windows', 'ubuntu']
        }
    ]
};
