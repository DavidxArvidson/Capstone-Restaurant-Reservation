const knex = require("../db/connection");

const tableName = "reservations";

function list(date) {
	if (date) {
		return knex(tableName)
			.select("*")
			.where({ reservation_date: date })
			.orderBy("reservation_time", "asc");
	}

	return knex(tableName)
		.select("*");
}

function search(mobile_number) {
	return knex(tableName)
	  .select("*")
	  .whereRaw(
		"translate(mobile_number, '() -', '') like ?",
		`%${mobile_number.replace(/\D/g, "")}%`
	  )
	  .orderBy("reservation_date");
  }

function newRes(reservation) {
	return knex(tableName)
		.insert(reservation)
		.returning("*");
}

function read(reservation_id) {
    return knex(tableName)
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

function update(reservation_id, status) {
    return knex(tableName)
        .where({ reservation_id: reservation_id })
        .update({ status: status });
}

function edit(reservation_id, reservation) {
	return knex(tableName)
		.where({ reservation_id: reservation_id })
		.update({ ...reservation })
		.returning("*");
}

module.exports = {
	list,
	search,
	newRes,
	read,
	update,
	edit,
  };