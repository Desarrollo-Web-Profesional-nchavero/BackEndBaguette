import mongoose from "mongoose";
import { describe, expect, test, beforeEach } from "@jest/globals";


import {
  creaPedido,
  listaPedidos,
  listaAllPedidos,
  listaPedidosByNombre,
  listPedidosByPagado,
  getPedidoById,
  modificaPedido,
  eliminaPedido

} from "../servicios/pedidos.js";
import { Pedido } from "../bd/modelos/pedido.js";

/**
 * Pruebas unitarias para las operaciones CRUD de pedidos utilizando Jest y Mongoose.
 * Estas pruebas verifican la creación, lectura, actualización y eliminación de pedidos en la base de datos.
 * Se utilizan ejemplos de pedidos para validar el correcto funcionamiento de las funciones del servicio de pedidos.
 */
describe("Creando Pedidos", () => {
  // Prueba para verificar que la creación de un pedido con todos los parámetros es exitosa.
  test("Con todos los parámetros será exitoso", async () => {
    const pedido = new Pedido({
      nombre: "Juan Gabriel Lopez",
      telefono: "4181231234",
      fecha_solicitud: "07/02/2026",
      fecha_envio: "09/02/2026",
      total: 45.0,
      pagado: "PAGADO",
      abono: 45.0,
      comentario: "Ha sido pagado el pedido",
    });
    const createdPedido = await creaPedido(pedido);
    expect(createdPedido._id).toBeInstanceOf(mongoose.Types.ObjectId);
    const foundPedido = await Pedido.findById(createdPedido._id);
    expect(foundPedido).toEqual(expect.objectContaining(post));
    expect(foundPedido.createdAt).toBeInstanceOf(Date);
    expect(foundPedido.updatedAt).toBeInstanceOf(Date);
  });

  // Prueba para verificar que la creación de un pedido sin el nombre requerido falla con un error de validación.
  test("Sin nombre debe fallar", async () => {
    const pedido = new Pedido({
      telefono: "4181231234",
      fecha_solicitud: "07/02/2026",
      fecha_envio: "09/02/2026",
      total: 45.0,
      pagado: "PAGADO",
      abono: 45.0,
      comentario: "Ha sido pagado el pedido",
    });
    try {
      await creaPedido(pedido);
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.message).toContain("`Nombre` es requerido");
    }
  });

  // Prueba para verificar que la creación de un pedido con los parámetros mínimos requeridos es exitosa.
  test("Con parámetros mínimos debe ser exitoso", async () => {
    const pedido = new Pedido({
      nombre: "Juan Gabriel Lopez",
      telefono: "4181231234",
      fecha_solicitud: "07/02/2026",
      fecha_envio: "09/02/2026",
      total: 45.0,
    });
    const createdPedido = await creaPedido(pedido);
    expect(createdPedido._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});

// Ejemplos de pedidos para las pruebas de listado, actualización y eliminación.
const ejemplosPedidos = [
{
    nombre: 'Alfredo Lima Perú',
    telefono: '4181231235',
    fecha_solicitud: '07/02/2026',
    fecha_envio: '09/02/2026',
    total: 90.00,
    pagado: 'PAGADO',
    abono: 45.00,
    comentario:'Ha sido pagado el pedido',
},
{
    nombre: 'Natalia Arévalo Sanchez',
    telefono: '4181231236',
    fecha_solicitud: '07/02/2026',
    fecha_envio: '09/02/2026',
    total: 90.00,
    pagado: 'NO PAGADO',
    abono: 90.00,
    comentario:'Ha sido pagado el pedido',
},
{
    nombre: 'Alberto Olmos Vazquez',
    telefono: '4181231237',
    fecha_solicitud: '07/02/2026',
    fecha_envio: '09/02/2026',
    total: 100.00,
    pagado: 'PAGADO',
    abono: 50.00,
    comentario:'NO Ha sido pagado el pedido en su totalidad',
}];

// Variable para almacenar los pedidos creados durante las pruebas.
let creandoEjemplosPedidos = [];

/**
 * Función que se ejecuta antes de cada prueba para limpiar la colección de pedidos 
 * y crear nuevos pedidos de ejemplo en la base de datos.
 */
beforeEach(async () => {
  await Pedido.deleteMany({});
  creandoEjemplosPedidos = [];
  for (const pedido of ejemplosPedidos) {
    const creaPedido = new Pedido(pedido);
    creandoEjemplosPedidos.push(await creaPedido.save());
  }
});

/**
 * 
 */
describe("Listando Pedidos", () => {
  test("Debe regresar todos los pedidos", async () => {
    const pedidos = await listaAllPedidos();
    expect(pedidos.length).toEqual(creandoEjemplosPedidos.length);
  });

  test("should return posts sorted by creation date descending by default", async () => {
    const pedidos = await listaAllPedidos();
    const sortedSamplePosts = creandoEjemplosPedidos.sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    expect(pedidos.map((pedido) => pedido.createdAt)).toEqual(
      sortedSamplePosts.map((pedido) => pedido.createdAt),
    );
  });

  test("should take into account provided sorting options", async () => {
    const pedidos = await listaAllPedidos({
      sortBy: "updatedAt",
      sortOrder: "ascending",
    });
    const sortedSamplePosts = creandoEjemplosPedidos.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    );
    expect(pedidos.map((post) => pedido.updatedAt)).toEqual(
      sortedSamplePosts.map((pedido) => pedido.updatedAt),
    );
  });

  test("should be able to filter posts by author", async () => {
    const pedidos = await listaPedidosByNombre("Natalia Arévalo Sanchez");
    expect(pedidos.length).toBe(3);
  });

  test("should be able to filter posts by tag", async () => {
    const pedidos = await listPedidosByPagado("PAGADO");
    expect(pedidos.length).toBe(1);
  });
});

describe("getting a post", () => {
  test("should return the full post", async () => {
    const pedido = await getPedidoById(creandoEjemplosPedidos[0]._id);
    expect(pedido.toObject()).toEqual(creandoEjemplosPedidos[0].toObject());
  });

  test("should fail if the id does not exist", async () => {
    const pedido = await getPedidoById("000000000000000000000000");
    expect(pedido).toEqual(null);
  });
});

describe("updating posts", () => {
  test("should update the specified property", async () => {
    await modificaPedido(creandoEjemplosPedidos[0]._id, {
      nombre: "Test Nombre",
    });
    const modificaPedido = await Pedido.findById(creandoEjemplosPedidos[0]._id);
    expect(modificaPedido.nombre).toEqual("Test Nombre");
  });

  test("should not update other properties", async () => {
    await modificaPedido(creandoEjemplosPedidos[0]._id, {
      nombre: "Test Nombre",
    });
    const modificaPedido = await Pedido.findById(creandoEjemplosPedidos[0]._id);
    expect(modificaPedido.nombre).toEqual("Alfonso Rico Ávalos");
  });

  test("should update the updatedAt timestamp", async () => {
    await modificaPedido(creandoEjemplosPedidos[0]._id, {
      nombre: "Test Nombre",
    });
    const modificaPedido = await Pedido.findById(creandoEjemplosPedidos[0]._id);
    expect(modificaPedido.updatedAt.getTime()).toBeGreaterThan(
      creandoEjemplosPedidos[0].updatedAt.getTime(),
    );
  });

  test("should fail if the id does not exist", async () => {
    const pedido = await modificaPedido("000000000000000000000000", {
      nombre: "Test Nombre",
    });
    expect(pedido).toEqual(null);
  });
});

describe("deleting posts", () => {
  test("should remove the post from the database", async () => {
    const result = await eliminaPedido(creandoEjemplosPedidos[0]._id);
    expect(result.deletedCount).toEqual(1);
    const deletedPost = await Pedido.findById(creandoEjemplosPedidos[0]._id);
    expect(deletedPost).toEqual(null);
  });

  test("should fail if the id does not exist", async () => {
    const result = await eliminaPedido("000000000000000000000000");
    expect(result.deletedCount).toEqual(0);
  });
});