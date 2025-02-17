import { useState } from 'react';

export function SystemAdmin() {
    // 用来跟踪面包屑导航的状态
    const [breadcrumb, setBreadcrumb] = useState(['Home']);

    // 处理侧边栏点击，更新面包屑导航
    const handleNavClick = (name) => {
        setBreadcrumb([name]); // 只显示一个项，例如"首页"、"Dashboard"等
    };

    return (
        <div className="flex min-h-screen">
            {/* 侧边栏 */}
            <div className="w-64 h-screen bg-base-200 text-base-content flex-shrink-0">
                <div className="p-4 text-center text-lg">
                    <h1 className="text-2xl font-bold">管理员后台</h1>
                </div>
                <ul className="menu p-2 text-center">
                    <li className="mb-2">
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-base-300 rounded"
                            onClick={() => handleNavClick('首页')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            首页
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-base-300 rounded"
                            onClick={() => handleNavClick('Dashboard')}
                        >
                            <svg className="w-6 h-6 text-gray-700 " aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                                      d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>

                            角色管理
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-base-300 rounded"
                            onClick={() => handleNavClick('Users')}
                        >
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                 viewBox="0 0 24 24">
                                <path fill-rule="evenodd"
                                      d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                                      clip-rule="evenodd"/>
                            </svg>

                            用户管理
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-base-300 rounded"
                            onClick={() => handleNavClick('Settings')}
                        >
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6H8C6.89543 6 6 6.89543 6 8V18C6 19.1046 6.89543 20 8 20H18C19.1046 20 20 19.1046 20 18V8C20 6.89543 19.1046 6 18 6Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M18 28H8C6.89543 28 6 28.8954 6 30V40C6 41.1046 6.89543 42 8 42H18C19.1046 42 20 41.1046 20 40V30C20 28.8954 19.1046 28 18 28Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M35 20C38.866 20 42 16.866 42 13C42 9.13401 38.866 6 35 6C31.134 6 28 9.13401 28 13C28 16.866 31.134 20 35 20Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M40 28H30C28.8954 28 28 28.8954 28 30V40C28 41.1046 28.8954 42 30 42H40C41.1046 42 42 41.1046 42 40V30C42 28.8954 41.1046 28 40 28Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg>
                            系统管理
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-base-300 rounded"
                            onClick={() => handleNavClick('Settings')}
                        >
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10H6C4.89543 10 4 10.8954 4 12V38C4 39.1046 4.89543 40 6 40H42C43.1046 40 44 39.1046 44 38V35.5" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 23H18" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M10 31H34" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="16" r="6" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 28.4187C42.0468 24.6023 37.9999 22 33.9999 22C29.9999 22 28.0071 23.1329 25.9502 25" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            权限管理
                        </a>
                    </li>
                </ul>
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 flex flex-col">
                {/* 面包屑导航 */}
                <div className="p-2 border-b border-gray-200 bg-base-100 flex justify-between items-center">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            {breadcrumb.map((crumb, index) => (
                                <li key={index} className={index === breadcrumb.length - 1 ? 'text-green-600' : ''}>
                                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.94971 11.9497H39.9497" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.94971 23.9497H39.9497" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.94971 35.9497H39.9497" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <a className="hover:text-primary ml-1">{crumb}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 头像部分 */}
                    <div className="flex items-center gap-1 mr-1">
                        <img
                            src=""
                            alt="头像"
                            className="w-10 h-10 rounded-full border-2 border-gray-300"
                        />
                        <p>用户名</p>
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36 18L24 30L12 18" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                </div>

                {/* 主内容 */}
                <div className="flex-1 p-8 bg-base-100">
                    <h1 className="text-3xl font-bold mb-4">{breadcrumb[breadcrumb.length - 1]}</h1>
                    <p className="text-base-content/80">这里是系统管理后台的主内容区域</p>
                </div>
            </div>
        </div>
    );
}
