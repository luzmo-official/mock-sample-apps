
public class User {
  public string username { get; set; }
  public string name { get; set; }
  public string email { get; set; }
  public string brand { get; set; }

  public User(string username, string name, string email, string brand) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.brand = brand;
  }
}