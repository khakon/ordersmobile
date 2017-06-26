using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebOrders.Controllers
{
    public class CustomersController : ApiController
    {
        // GET: api/Customers
        OrdersEntities db = new OrdersEntities();
        public IQueryable<Customer> Get(string agentId)
        {
            agents agent;
            var context = HttpContext.Current;
            agent = (agents)context.Cache["agent"];
            if (agent == null) return new List<Customer>().AsQueryable();
            var model = db.Customers.Where(m => m.idAgent.Trim() == agent.id).OrderBy(s => s.Kontr);
            return model;
        }

        // GET: api/Customers/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Customers
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Customers/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Customers/5
        public void Delete(int id)
        {
        }
    }
}
