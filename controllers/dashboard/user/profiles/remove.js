const mysql = require('lib/mysql');

/*
  DELETE api/dashboard/user/profiles/:profile
  RETURN
    { error: bool, message?: string }
  DESCRIPTION
    Delete a profile
    Will not delete if profile is linked to a service
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    // Get info object for all of user's linked services
    await db.getConnection();
    const rows = await db.query(
      'SELECT info FROM linked_services WHERE user_id = ?',
      [req.session.uid]
    );

    // Check if profile is linked to a service
    const linked = rows.findIndex(r =>
      JSON.parse(r.info).profile == req.params.profile
    ) > -1;

    if (linked) throw 'Cannot delete profiles that are linked to services';

    await db.query(
      'DELETE FROM profiles WHERE id = ? AND user_id = ?',
      [req.params.profile, req.session.uid]
    );
    db.release();

    if (!result.affectedRows) throw 'Could not delete profile';

    res.json({ error: false });
  }
  catch (err) {
    db.release();
    res.json({ error: true, message: err });
  }

}