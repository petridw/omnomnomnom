class Call < ActiveRecord::Base
  validates :day, presence: true, uniqueness: true
end
