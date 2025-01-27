export async function searchDocumentsMD(ctx: Context, next: () => Promise<any>) {
    const {
        vtex: {
            route: { params },
        },
        clients: { adminDocuments },
        query,
    } = ctx;

    const { dataEntity } = params;

    const dataEntityAcronym = dataEntity as string
    const where = query._where as string
    const sort = query._sort as string

    const fieldsArray = typeof query._fields === 'string' ? query._fields.split(',') : ['_all'];
    //dataEntity=BG
    //urls de prueba
    // si no funciona, verificar los permisos de las bases de datos, temas de filtrado y busqueda
    //_v/:dataEntity/search?_fields=title,show
    //_v/:dataEntity/search?_fields=title,show&_where=show=true


    try {
        const result = await adminDocuments.searchMd(where, fieldsArray, dataEntityAcronym, 1, 50, sort);
        ctx.body = result;
        ctx.status = 200;
    } catch (error) {
        ctx.body = { error: 'Internal Server Error' };
        ctx.status = 500;
    }

    await next();
}
