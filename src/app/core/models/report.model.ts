export interface ReportApiResponse {
    id: number;
    title: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    description: string;
}

export interface Report {
    id: number;
    title: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    description: string;
}

export function mapReportFromApi(api: ReportApiResponse): Report {
    return {
        id: api.id,
        title: api.title,
        date: api.date,
        status: api.status,
        description: api.description
    };
}
