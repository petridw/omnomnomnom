class CreateCalls < ActiveRecord::Migration
  def change
    create_table :calls do |t|
      t.string :day
      t.string :calls

      t.timestamps null: false
    end
  end
end
