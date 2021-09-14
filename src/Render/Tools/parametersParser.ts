function getJsonFromUrl(url?: string) : {[index: string]: any}
{
    if (!url) url = location.search;

    const query = url.substr(1);
    const result = {} as {[index: string]: any};

    for(const part of query.split("&"))
    {
        const item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    }

    return result;
}