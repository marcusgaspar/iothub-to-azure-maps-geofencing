using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AzureMaps.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AzureMaps.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ListBlobsFlatListing();
            return View();
        }

        public IActionResult Maps()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public void ListBlobsFlatListing()
        {

            string connectionString = "";
            string containerName = "";
            
            try
            {
                // Get a reference to a container named "sample-container" and then create it
                BlobContainerClient container = new BlobContainerClient(connectionString, containerName);

                string datafile = (@"wwwroot\data\devicesLocation.txt");
                using (var writer = new System.IO.StreamWriter(datafile))
                {
                    // Get all the blob names
                    foreach (BlobItem blob in container.GetBlobs())
                    {
                        Console.WriteLine(blob.Name);
                        // Get a temporary path on disk where we can download the file
                        string jsonfile = (@"wwwroot\data\" + blob.Name);

                        // Download the blob
                        BlobClient bobClient = container.GetBlobClient(blob.Name);
                        bobClient.DownloadTo(jsonfile);

                        using StreamReader filestream = new StreamReader(jsonfile);
                        writer.WriteLine(filestream.ReadLine());
                        
                        filestream.Close();
                        System.IO.File.Delete(jsonfile);
                    }

                }

            }
            catch (RequestFailedException e)
            {
                Console.WriteLine(e.Message);
                Console.ReadLine();
                throw;
            }
        }

    }
}
