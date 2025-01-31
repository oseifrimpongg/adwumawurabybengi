using MongoDB.Driver;

namespace Adwumawura.src.Db;

public class MongoDbClient
{
   private readonly MongoClient _client;
   private readonly IMongoDatabase _database;

   public MongoDbClient(string connectionString, string databaseName)
   {
      try
      {
         _client = new MongoClient(connectionString);
         _database = _client.GetDatabase(databaseName);
      }
      catch (Exception exception)
      {
         Console.WriteLine($"${exception.Message}");
      }
   }

   public IMongoCollection<UserModel> GetUsers()
   {
      return _database.GetCollection<UserModel>(Environment.GetEnvironmentVariable("USERS_COLLECTION"));
   }
}