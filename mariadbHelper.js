module.exports = {
    query: async function(pool, query){
        try{
            let conn = await pool.getConnection();

            return await conn.query(query);
        }catch(e){
            console.error(`[mariadb] - ${e}`);
        }finally{
            if(conn){
                conn.end();
            }
        }
    }
}