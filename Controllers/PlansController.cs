using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebOrders.Controllers
{
    public class PlansController : ApiController
    {
        OrdersEntities db = new OrdersEntities();
        public IQueryable Get()
        {
            var context = HttpContext.Current;
            var agent = (agents)context.Cache["agent"];
            return db.Plans.Where(s => s.agent == agent.id);
        }

        // GET: api/Plans/5
        //public string Get()
        //{
        //    return "value";
        //}

        // POST: api/Plans
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Plans/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Plans/5
        public void Delete(int id)
        {
        }
    }
}
