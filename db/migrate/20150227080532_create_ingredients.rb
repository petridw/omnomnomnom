class CreateIngredients < ActiveRecord::Migration
  def change
    create_table :ingredients do |t|
      t.string :searchValue
      t.string :description
      t.string :term

      t.timestamps null: false
    end
  end
end
