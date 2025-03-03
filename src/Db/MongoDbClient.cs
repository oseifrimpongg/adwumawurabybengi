using MongoDB.Bson;
using MongoDB.Driver;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace Adwumawura.src.Db;

public class MongoDbClient
{
   private readonly MongoClient? _client;
   private readonly IMongoDatabase? _database;

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

   public IMongoCollection<UserModel>? GetUsers()
   {
      return _database?.GetCollection<UserModel>(Environment.GetEnvironmentVariable("USERS_COLLECTION"));
   }

   // Database Client Operations
   public async Task SaveUserAsync(ITelegramBotClient telegramBotClient, Update update, IMongoCollection<UserModel> collection)
   {
      User? userUpdate = update?.Message?.From;
      if (userUpdate is null) return;

      var existingUser = collection.Find(u => u.UserId == userUpdate.Id).FirstOrDefault();

      if (existingUser is null)
      {
         var user = new UserModel()
         {
            Id = ObjectId.GenerateNewId(),
            UserId = userUpdate.Id,
            UserName = userUpdate?.Username,
            FirstName = userUpdate?.FirstName,
            LastName = userUpdate?.LastName,
            JoinDate = DateTime.Now,
            SubscriptionStatus = true
         };

         try
         {
            await collection.InsertOneAsync(user);
         }
         catch (Exception exception)
         {
            Console.WriteLine($"${exception.Message}");
         }

      }
   }
}