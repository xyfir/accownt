const validateData = require('lib/services/validate-data');
const mysql = require('lib/mysql');

/*
  PUT api/dashboard/user/services/:service
  RETURN
    { error: bool, message: string }
  DESCRIPTION
    Update the data that a user provides to a service
*/
module.exports = async function(req, res) {

  const db = new mysql();
  
  try {
    let { result, info } = await validateData(req);

    if (result != 'valid') throw result;

    await db.getConnection();

    const sql = `
      UPDATE linked_services SET info = ?
      WHERE user_id = ? AND service_id = ?
    `,
    vars = [
      JSON.stringify(info),
      req.session.uid, req.params.service
    ];
    result = await db.query(sql, vars);
    
    db.release();

    if (!result.affectedRows) throw 'Could not update data';
    
    res.json({ error: false, message: 'Service successfully updated' });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  };

}