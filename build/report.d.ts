interface Report {
    authoredAt: Date;
    fetchedAt: Date;
    author: string;
    url: string;
    platformID: string;
    content?: string;
    raw: {
        [key: string]: any;
    };
    from: string;
}
export default Report;
