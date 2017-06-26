using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebOrders.Controllers
{
    public class PricesController : ApiController
    {
        OrdersEntities db = new OrdersEntities();
        // GET: api/Prices
        public IQueryable Get()
        {
            var context = HttpContext.Current;
            var agent = (agents)context.Cache["agent"];
            var dep = db.agents1.Where(s => s.id == agent.id).FirstOrDefault().dep;
            var groups = db.GoodsAgents.Where(s => s.dep == dep);
            var list = db.Groups.Where(s => groups.Any(g => s.tree.Contains(g.code)));
            var root = db.Groups.Where(s => list.Any(g => g.tree.Contains(s.GroupId)));
            var items = db.Items.Where(s => root.Any(r => s.tree.Contains(r.GroupId)));
            var customers = db.Customers.Where(m => m.idAgent.Trim() == agent.id);
            return db.Prices.Where(s => items.Any(i => i.ItemId == s.TovId) && customers.Any(c=>c.idKontr == s.KnId)).Select(s => new { KnId = s.KnId, TovId = s.TovId, Price = s.Price1, Discount = s.Discount });
        }

        // GET: api/Prices/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Prices
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Prices/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Prices/5
        public void Delete(int id)
        {
        }
    }
}
