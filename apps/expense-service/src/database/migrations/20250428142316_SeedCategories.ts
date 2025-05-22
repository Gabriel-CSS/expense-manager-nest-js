import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategories1623478954013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO categories (id, name, status, "createdAt", "updatedAt") VALUES
      (uuid_generate_v4(), 'Alimentação', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (uuid_generate_v4(), 'Transporte', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (uuid_generate_v4(), 'Saúde', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (uuid_generate_v4(), 'Lazer', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (uuid_generate_v4(), 'Outros', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM categories WHERE name IN ('Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Outros')
    `);
  }
}