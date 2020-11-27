import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('costumer', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('queixa').notNullable();
    table.string('localDor').notNullable();
    table.string('pacote').notNullable();

  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('costumer');
}
