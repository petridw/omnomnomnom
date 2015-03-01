require 'rails_helper'

RSpec.describe Ingredient, type: :model do

  it "has a valid factory" do
    expect(build(:ingredient)).to be_valid
  end

  it "validates presence of searchValue" do
    expect(build(:ingredient, searchValue: nil)).to be_invalid
  end

  it "validates presence of description" do
    expect(build(:ingredient, description: nil)).to be_invalid
  end

  it "validates presence of term" do
    expect(build(:ingredient, term: nil)).to be_invalid
  end

  it "validates uniqueness of searchValue" do
    create(:ingredient, searchValue: "egg", description: "egg", term: "egg")
    expect(build(:ingredient, searchValue: "egg")).to be_invalid
  end

  it "validates uniqueness of description" do
    create(:ingredient, searchValue: "egg", description: "egg", term: "egg")
    expect(build(:ingredient, description: "egg")).to be_invalid
  end

  it "validates uniqueness of term" do
    create(:ingredient, searchValue: "egg", description: "egg", term: "egg")
    expect(build(:ingredient, term: "egg")).to be_invalid
  end  

end
