using WebOrders;
using WebOrders.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Security;

namespace RefsApi.Controllers
{
    public class AccountController : ApiController
    {
        OrdersEntities db = new OrdersEntities();
        public IQueryable Get()
        {
            var model = db.agents1.Select(s => new {id = s.id, agent = s.agent}).OrderBy(m => m.agent);
            return model;
        }

        // GET api/customers/5
        public bool Get(string password)
        {
            agents agent;
            var context = HttpContext.Current;
            if (String.IsNullOrEmpty(password))
            {
                agent = (agents)context.Cache["agent"];
                if (agent == null) return false;
                return true;
            }
            if (!db.agents1.Any(s => s.password == password)) return false;
            var item = db.agents1.Where(s => s.password == password).FirstOrDefault();
            agent = new agents();
            agent.agent = item.agent;
            agent.password = item.password;
            agent.id = item.id;
            if (context != null)
            {
                context.Cache["agent"] = agent;
            }
            return true;
        }

        // POST api/customers
        public void Post([FromBody]string value)
        {
        }

        // PUT api/customers/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/customers/5
        public void Delete(int id)
        {
        }

    }
}
