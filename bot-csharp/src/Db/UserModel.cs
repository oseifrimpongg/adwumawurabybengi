using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Adwumawura.src.Db;

public class UserModel
{
   [BsonId]
   [BsonRepresentation(BsonType.ObjectId)]
   public ObjectId Id { get; set; }

   [BsonElement("userId")]
   public long UserId { get; set; }

   [BsonElement("userName")]
   public string? UserName { get; set; }

   [BsonElement("firstName")]
   public required string? FirstName { get; set; }

   [BsonElement("lastName")]
   public string? LastName { get; set; }

   [BsonElement("joinDate")]
   public DateTime JoinDate { get; set; } = DateTime.Now;

   [BsonElement("subscriptionStatus")]
   public bool SubscriptionStatus { get; set; } = false;

}