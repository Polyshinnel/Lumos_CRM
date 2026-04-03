export type DealStage = 'new' | 'call' | 'measurement' | 'production' | 'installation';

export const stageLabels: Record<DealStage, string> = {
    new: 'Новое обращение',
    call: 'Созвон с клиентом',
    measurement: 'Назначен замер',
    production: 'Отправлено в производство',
    installation: 'Назначен монтаж',
};

export interface DealInfo {
    id: number;
    stage: DealStage;
    clientName: string;
    phone: string;
    address: string;
    passport: string;
    source: string;
    responsibleManager: string;
    dealSum: number;
    measurerName?: string;
    measurementDate?: string;
    installerName?: string;
    installationDate?: string;
    createdAt: string;
}

export type AttachmentFileType = 'image' | 'excel' | 'word' | 'pdf';

export interface MaterialItem {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    imageUrl?: string;
}

interface BaseEvent {
    id: number;
    timestamp: string;
}

interface StatusChangeEvent extends BaseEvent {
    type: 'status_change';
    fromStatus: string;
    toStatus: string;
    changedBy: string;
}

interface ResponsibleChangeEvent extends BaseEvent {
    type: 'responsible_change';
    fromResponsible: string;
    toResponsible: string;
    changedBy: string;
}

interface TaskEvent extends BaseEvent {
    type: 'task';
    taskName: string;
    taskText: string;
    deadline: string;
    assignedBy: string;
    isAutomatic: boolean;
}

interface AttachmentEvent extends BaseEvent {
    type: 'attachment';
    fileType: AttachmentFileType;
    fileName: string;
    comment?: string;
}

interface MeasurementEvent extends BaseEvent {
    type: 'measurement';
    measurerName: string;
    measurementDate: string;
}

interface InstallationEvent extends BaseEvent {
    type: 'installation';
    installerName: string;
    installationDate: string;
}

interface AudioEvent extends BaseEvent {
    type: 'audio';
    phoneNumber: string;
    duration: string;
}

interface MaterialsEvent extends BaseEvent {
    type: 'materials';
    items: MaterialItem[];
}

interface CommentEvent extends BaseEvent {
    type: 'comment';
    authorName: string;
    text: string;
}

export type DealEvent =
    | StatusChangeEvent
    | ResponsibleChangeEvent
    | TaskEvent
    | AttachmentEvent
    | MeasurementEvent
    | InstallationEvent
    | AudioEvent
    | MaterialsEvent
    | CommentEvent;
