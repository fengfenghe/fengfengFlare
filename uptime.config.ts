import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // Title for your status page
  title: "您的状态页面标题",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://github.com/yourname', label: 'GitHub' },
    { link: 'https://yourblog.com/', label: 'Blog' },
    { link: 'mailto:your@email.com', label: '联系我们', highlight: true },
  ],
  // [OPTIONAL] Group your monitors
  group: {
    '🌐 公开服务': ['n8n'],
    '🔐 内部服务': ['test_tcp_monitor'],
  },
  // [OPTIONAL] Set the path to your favicon, default to '/favicon.ico' if not specified
  favicon: '/favicon.ico',
  // [OPTIONAL] Maintenance related settings
  maintenances: {
    upcomingColor: 'gray',
  },
}

const workerConfig: WorkerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below
  // passwordProtection: 'username:password',
  
  // Define all your monitors here
  monitors: [
    // N8n 监控 - 修正版本
    {
      id: 'n8n',
      name: 'N8n Server',
      method: 'GET',
      target: 'https://iminshanghai-n8n.hf.space',
      tooltip: 'N8n 工作流自动化平台',
      statusPageLink: 'https://iminshanghai-n8n.hf.space',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      // 对于 GET 请求，移除 body 和 Authorization header
      headers: {
        'User-Agent': 'Uptimeflare',
      },
      // 移除 body，因为 GET 请求不需要
      // 移除 responseKeyword 和 responseForbiddenKeyword，除非 N8n 返回特定内容
      // 移除 checkProxy，除非需要地理分布式监控
    },
    
    // TCP 监控示例
    {
      id: 'test_tcp_monitor',
      name: 'SSH 服务监控',
      method: 'TCP_PING',
      target: 'your-server-ip:22', // 替换为实际的服务器IP
      tooltip: 'SSH 服务状态检查',
      statusPageLink: 'https://your-server.com',
      timeout: 5000,
    },
  ],
  
  // [Optional] Notification settings
  notification: {
    webhook: {
      // 替换为您的实际 Telegram Bot Token
      url: 'https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payloadType: 'json',
      payload: {
        chat_id: 12345678, // 替换为您的 Telegram Chat ID
        text: '$MSG',
      },
      timeout: 10000,
    },
    timeZone: 'Asia/Shanghai',
    gracePeriod: 5,
    // 修正：使用实际存在的监控ID
    skipNotificationIds: [], // 或者移除这一行
  },
  
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 状态变化时的回调
      console.log(`Monitor ${monitor.name} is now ${isUp ? 'UP' : 'DOWN'}`);
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 持续故障时的回调
      console.log(`Monitor ${monitor.name} is still down: ${reason}`);
    },
  },
}

// 维护配置 - 修正版本
const maintenances: MaintenanceConfig[] = [
  {
    // 使用实际存在的监控ID
    monitors: ['n8n'],
    title: 'N8n 系统维护',
    body: 'N8n 工作流平台定期维护升级',
    start: '2025-01-15T02:00:00+08:00',
    end: '2025-01-15T04:00:00+08:00',
    color: 'blue',
  },
]

// Don't forget this, otherwise compilation fails.
export { maintenances, pageConfig, workerConfig }
