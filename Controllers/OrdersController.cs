using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace WebOrders.Controllers
{
    public class OrdersController : Controller
    {
        // GET: api/Orders
        OrdersEntities db = new OrdersEntities();
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpPost]
        public string Save(string model)
        {
            try
            {
                agents agent;
                var context = System.Web.HttpContext.Current;
                agent = (agents)context.Cache["agent"];
                var log = new logsString { id = 0, agent = agent.agent, content = model, date = DateTime.Now };
                db.Entry(log).State = EntityState.Added;
                db.SaveChanges();
                var logs = new JavaScriptSerializer().Deserialize<log[]>(model);
                foreach (var item in logs)
                {
                    item.timeStampServer = DateTime.Now;
                    db.Entry(item).State = EntityState.Added;
                    db.SaveChanges();
                }
                var orders = new JavaScriptSerializer().Deserialize<Order[]>(model);
                foreach (var a in orders.ToList())
                {
                     foreach (var c in db.Orders.Where(o => o.agent == a.agent && o.customer == a.customer && o.number == a.number).ToList())
                    {
                                db.Entry(c).State = EntityState.Deleted;
                                db.SaveChanges();
                    }
                }
                foreach (var item in orders)
                {
                    db.Entry(item).State = EntityState.Added;
                    db.SaveChanges();
                }
                return "Записано";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
