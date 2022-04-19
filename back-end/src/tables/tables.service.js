const knex = require("../db/connection");

const tableName = "tables";

function list() {
	return knex(tableName)
		.select("*");
}

function newTable(table) {
	return knex(tableName)
		.insert(table)
		.returning("*");
}

function read(table_id) {
    return knex(tableName)
        .select("*")
        .where({ table_id: table_id })
        .first();
}

function readRes(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

function occupy(table_id, reservation_id) {
    return knex(tableName)
        .where({ table_id: table_id })
        .update({ reservation_id: reservation_id , status: "occupied" });
}

function free(table_id) {
    return knex(tableName)
        .where({ table_id: table_id })
        .update({ reservation_id: null, status: "free" });
}

function updateRes(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update({ status: status });
}

module.exports = {
	list,
	newTable,
	read,
	readRes,
	occupy,
	free,
	updateRes,
}