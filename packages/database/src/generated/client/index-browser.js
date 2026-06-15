
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logoUrl: 'logoUrl',
  website: 'website',
  industry: 'industry',
  teamSize: 'teamSize',
  subscriptionPlan: 'subscriptionPlan',
  subscriptionStatus: 'subscriptionStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  passwordHash: 'passwordHash',
  avatarUrl: 'avatarUrl',
  role: 'role',
  status: 'status',
  lastLogin: 'lastLogin',
  bio: 'bio',
  timezone: 'timezone',
  notificationPreferences: 'notificationPreferences',
  isEmailVerified: 'isEmailVerified',
  emailVerificationToken: 'emailVerificationToken',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserInviteScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  email: 'email',
  role: 'role',
  token: 'token',
  invitedBy: 'invitedBy',
  status: 'status',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  deviceInfo: 'deviceInfo',
  ipAddress: 'ipAddress',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.LoginAttemptScalarFieldEnum = {
  id: 'id',
  email: 'email',
  ipAddress: 'ipAddress',
  success: 'success',
  createdAt: 'createdAt'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  companyName: 'companyName',
  source: 'source',
  status: 'status',
  ownerId: 'ownerId',
  estimatedValue: 'estimatedValue',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeadActivityScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  activityType: 'activityType',
  note: 'note',
  createdBy: 'createdBy',
  createdAt: 'createdAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  companyName: 'companyName',
  website: 'website',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  country: 'country',
  gstNumber: 'gstNumber',
  notes: 'notes',
  timezone: 'timezone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientContactScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  name: 'name',
  designation: 'designation',
  email: 'email',
  phone: 'phone'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  clientId: 'clientId',
  name: 'name',
  description: 'description',
  status: 'status',
  priority: 'priority',
  budget: 'budget',
  startDate: 'startDate',
  endDate: 'endDate',
  progress: 'progress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  dueDate: 'dueDate',
  status: 'status'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  assigneeId: 'assigneeId',
  title: 'title',
  description: 'description',
  priority: 'priority',
  status: 'status',
  dueDate: 'dueDate',
  estimatedHours: 'estimatedHours',
  actualHours: 'actualHours',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskCommentScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  userId: 'userId',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.TaskChecklistScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  title: 'title',
  completed: 'completed'
};

exports.Prisma.FileScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  uploadedBy: 'uploadedBy',
  fileName: 'fileName',
  fileType: 'fileType',
  fileSize: 'fileSize',
  storagePath: 'storagePath',
  createdAt: 'createdAt'
};

exports.Prisma.ProjectFileScalarFieldEnum = {
  projectId: 'projectId',
  fileId: 'fileId'
};

exports.Prisma.MeetingScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  title: 'title',
  description: 'description',
  meetingLink: 'meetingLink',
  startTime: 'startTime',
  endTime: 'endTime',
  createdBy: 'createdBy'
};

exports.Prisma.UserMeetingScalarFieldEnum = {
  userId: 'userId',
  meetingId: 'meetingId'
};

exports.Prisma.ProposalScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  title: 'title',
  content: 'content',
  amount: 'amount',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContractScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  proposalId: 'proposalId',
  title: 'title',
  fileUrl: 'fileUrl',
  signed: 'signed',
  signedAt: 'signedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  clientId: 'clientId',
  invoiceNumber: 'invoiceNumber',
  subtotal: 'subtotal',
  taxAmount: 'taxAmount',
  totalAmount: 'totalAmount',
  dueDate: 'dueDate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  description: 'description',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  paymentGateway: 'paymentGateway',
  transactionId: 'transactionId',
  amount: 'amount',
  paymentMethod: 'paymentMethod',
  status: 'status',
  paidAt: 'paidAt'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  category: 'category',
  description: 'description',
  amount: 'amount',
  receiptUrl: 'receiptUrl',
  expenseDate: 'expenseDate'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  message: 'message',
  type: 'type',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.WhatsAppConversationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  clientId: 'clientId',
  phone: 'phone',
  lastMessage: 'lastMessage',
  updatedAt: 'updatedAt'
};

exports.Prisma.WhatsAppMessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  senderType: 'senderType',
  content: 'content',
  messageType: 'messageType',
  createdAt: 'createdAt'
};

exports.Prisma.AutomationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  triggerType: 'triggerType',
  actionType: 'actionType',
  isActive: 'isActive'
};

exports.Prisma.AutomationLogScalarFieldEnum = {
  id: 'id',
  automationId: 'automationId',
  status: 'status',
  error: 'error',
  executedAt: 'executedAt'
};

exports.Prisma.AIConversationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  title: 'title',
  createdAt: 'createdAt'
};

exports.Prisma.AIMessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  role: 'role',
  content: 'content',
  tokenUsage: 'tokenUsage',
  createdAt: 'createdAt'
};

exports.Prisma.DailyMetricsScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  metricDate: 'metricDate',
  revenue: 'revenue',
  expenses: 'expenses',
  activeProjects: 'activeProjects',
  activeClients: 'activeClients'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  oldValue: 'oldValue',
  newValue: 'newValue',
  createdAt: 'createdAt'
};

exports.Prisma.TimeLogScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  userId: 'userId',
  description: 'description',
  duration: 'duration',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  Organization: 'Organization',
  User: 'User',
  UserInvite: 'UserInvite',
  UserSession: 'UserSession',
  LoginAttempt: 'LoginAttempt',
  Lead: 'Lead',
  LeadActivity: 'LeadActivity',
  Client: 'Client',
  ClientContact: 'ClientContact',
  Project: 'Project',
  Milestone: 'Milestone',
  Task: 'Task',
  TaskComment: 'TaskComment',
  TaskChecklist: 'TaskChecklist',
  File: 'File',
  ProjectFile: 'ProjectFile',
  Meeting: 'Meeting',
  UserMeeting: 'UserMeeting',
  Proposal: 'Proposal',
  Contract: 'Contract',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  Payment: 'Payment',
  Expense: 'Expense',
  Notification: 'Notification',
  WhatsAppConversation: 'WhatsAppConversation',
  WhatsAppMessage: 'WhatsAppMessage',
  Automation: 'Automation',
  AutomationLog: 'AutomationLog',
  AIConversation: 'AIConversation',
  AIMessage: 'AIMessage',
  DailyMetrics: 'DailyMetrics',
  AuditLog: 'AuditLog',
  TimeLog: 'TimeLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
