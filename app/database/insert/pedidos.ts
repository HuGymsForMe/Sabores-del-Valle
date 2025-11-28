import { getDB } from "../db";

export async function insertPedido(pedido: any) {
  const db = await getDB();

  await db.runAsync(
    `
    INSERT OR REPLACE INTO ls_pedido (
      codigoCliente, codigoVendedor, comentariosPicking, direccionEnvio,
      entradaDocumento, estado, estadoDocumento, estadoPedido,
      fechaActualizacion, fechaCreacion, fechaDocumento, importeIVA,
      importeTotal, incidenciaDocumento, metodoPago, nombreCliente,
      pick, pickStatus, porcDescuento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      pedido.codigoCliente,
      pedido.codigoVendedor,
      pedido.comentariosPicking ?? "",
      pedido.direccionEnvio,
      pedido.entradaDocumento,
      pedido.estado,
      pedido.estadoDocumento ?? 0,
      pedido.estadoPedido ?? 0,
      pedido.fechaActualizacion,
      pedido.fechaCreacion,
      pedido.fechaDocumento,
      pedido.importeIVA ?? 0,
      pedido.importeTotal ?? 0,
      pedido.incidenciaDocumento ?? null,
      pedido.metodoPago ?? "Sin método",
      pedido.nombreCliente ?? "Cliente desconocido",
      pedido.pick ? 1 : 0,
      Number(pedido.pickStatus ?? 0),
      Number(pedido.porcDescuento ?? 0),
    ]
  );

  // --- Inserta líneas del pedido ---
  for (const linea of pedido.lineasPedidoCliente ?? []) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO ls_lineas_pedido (
        entradaDocumento, numeroLinea, cantidad, codigoAlmacen,
        codigoProducto, codigoUnidadMedida, codigoVendedor, descripcion,
        elementosPorUnidad, estado, fechaEnvio, grupoIVA, importe, moneda, nombreUnidadMedida,
        pickStatus, pickStatusEx, porcDescuento, porcIVA, precioConIVA, precioUnidad, totalLinea,
        unidadMedida, estadoLinea, incidenciaLinea
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        pedido.entradaDocumento,
        linea.numeroLinea,
        Number(linea.cantidad ?? 0),
        linea.codigoAlmacen,
        linea.codigoProducto,
        linea.codigoUnidadMedida,
        linea.codigoVendedor,
        linea.descripcion,
        Number(linea.elementosPorUnidad ?? 1),
        linea.estado,
        linea.fechaEnvio,
        linea.grupoIVA,
        Number(linea.importe ?? 0),
        linea.moneda ?? "EUR",
        linea.nombreUnidadMedida,
        Number(linea.pickStatus ?? 0),
        linea.pickStatusEx ?? "",
        Number(linea.porcDescuento ?? 0),
        Number(linea.porcIVA ?? 0),
        Number(linea.precioConIVA ?? 0),
        Number(linea.precioUnidad ?? 0),
        Number(linea.totalLinea ?? 0),
        Number(linea.unidadMedida ?? -1),
        linea.estadoLinea ?? 1,
        linea.incidenciaLinea ?? null,
      ]
    );
  }

  console.log(`✅ Pedido ${pedido.entradaDocumento} y sus líneas insertados correctamente`);
}

export async function seedIfEmpty() {
  const db = await getDB();
  const row = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) as c FROM ls_pedido`
  );

  if (row?.c && row.c > 0) {
    console.log("ℹ️ Seed omitido (ya hay pedidos)");
    return;
  }

  const pedidoCerrado = {
    numeroDocumento: 1,
    entradaDocumento: 15,
    fechaDocumento: "2025-11-27T00:00:00",
    fechaVencimiento: "2025-11-27T00:00:00",
    fechaCreacion: "2025-11-27T00:00:00",
    fechaActualizacion: "2025-11-27T00:00:00",
    codigoCliente: "C0000003",
    nombreCliente: "Diego Paez",
    direccionEnvio: "Calle Rastra 7\r\r19492 EL RECUENCO\rESPAÑA",
    estado: "CERRADO",
    importeTotal: 0.9,
    importeIVA: 0.08,
    porcDescuento: 0,
    codigoVendedor: 2,
    metodoPago: "Efectivo",
    enviado: false,
    pick: false,
    pickStatus: false,
    comentariosPicking: "",
    estadoDocumento: 3,
    incidenciaDocumento: null,
    lineasPedidoCliente: [
      {
        numeroLinea: 0,
        codigoProducto: "2091",
        descripcion: "TOMATE FRITO ORLANDO BRIK 350 GRS",
        fechaEnvio: "2025-11-27T00:00:00",
        cantidad: 1,
        cantidadPaquetes: 1,
        unidadMedida: -1,
        codigoUnidadMedida: "Manual",
        nombreUnidadMedida: "Unidad",
        elementosPorUnidad: 1,
        estado: "ABIERTO",
        precioUnidad: 0.818,
        precioConIVA: 0.9,
        grupoIVA: "R2",
        porcIVA: 10,
        porcDescuento: 0,
        importe: 0.818,
        totalLinea: 0.82,
        moneda: "EUR",
        codigoAlmacen: "03",
        direccionDeEntrega: "Calle Rastra 7\r\r19492 EL RECUENCO\rESPAÑA",
        pickStatus: false,
        pickStatusEx: "N",
        codigoVendedor: 2,
        estadoLinea: 3,
        incidenciaLinea: null,
      },
      {
        numeroLinea: 1,
        codigoProducto: "2081",
        descripcion: "PATATAS FRITAS LAY'S JAMÓN 180 GRS",
        fechaEnvio: "2025-11-27T00:00:00",
        cantidad: 1,
        cantidadPaquetes: 1,
        unidadMedida: -1,
        codigoUnidadMedida: "Manual",
        nombreUnidadMedida: "Unidad",
        elementosPorUnidad: 1,
        estado: "ABIERTO",
        precioUnidad: 1.436,
        precioConIVA: 1.57,
        grupoIVA: "R2",
        porcIVA: 10,
        porcDescuento: 0,
        importe: 1.436,
        totalLinea: 1.44,
        moneda: "EUR",
        codigoAlmacen: "03",
        direccionDeEntrega: "Calle Rastra 7\r\r19492 EL RECUENCO\rESPAÑA",
        pickStatus: 3,
        pickStatusEx: "N",
        codigoVendedor: 2,
        estadoLinea: 3,
        incidenciaLinea: null,
      },
    ],
  };

  const pedidoAbierto = {
    numeroDocumento: 2,
    entradaDocumento: 16,
    fechaDocumento: "2025-11-27T00:00:00",
    fechaVencimiento: "2025-11-27T00:00:00",
    fechaCreacion: "2025-11-27T00:00:00",
    fechaActualizacion: "2025-11-27T00:00:00",
    codigoCliente: "C0000004",
    nombreCliente: "Lucía Fernández",
    direccionEnvio: "Av. de la Libertad 12, Madrid, España",
    estado: "ABIERTO",
    importeTotal: 2.47,
    importeIVA: 0.22,
    porcDescuento: 0,
    codigoVendedor: 3,
    metodoPago: "Tarjeta",
    enviado: false,
    pick: false,
    pickStatus: false,
    comentariosPicking: "",
    estadoDocumento: 1,
    incidenciaDocumento: null,
    lineasPedidoCliente: [
      {
        numeroLinea: 0,
        codigoProducto: "3021",
        descripcion: "LECHE SEMIDESNATADA 1L",
        fechaEnvio: "2025-11-27T00:00:00",
        cantidad: 2,
        cantidadPaquetes: 1,
        unidadMedida: -1,
        codigoUnidadMedida: "Manual",
        nombreUnidadMedida: "Unidad",
        elementosPorUnidad: 1,
        estado: "ABIERTO",
        precioUnidad: 1.125,
        precioConIVA: 1.24,
        grupoIVA: "R1",
        porcIVA: 10,
        porcDescuento: 0,
        importe: 1.125,
        totalLinea: 2.25,
        moneda: "EUR",
        codigoAlmacen: "01",
        direccionDeEntrega: "Av. de la Libertad 12, Madrid, España",
        pickStatus: 1,
        pickStatusEx: "N",
        codigoVendedor: 3,
        estadoLinea: 1,
        incidenciaLinea: null,
      },
      {
        numeroLinea: 1,
        codigoProducto: "4023",
        descripcion: "PAN DE MOLDE BIMBO 450 GRS",
        fechaEnvio: "2025-11-27T00:00:00",
        cantidad: 1,
        cantidadPaquetes: 1,
        unidadMedida: -1,
        codigoUnidadMedida: "Manual",
        nombreUnidadMedida: "Unidad",
        elementosPorUnidad: 1,
        estado: "ABIERTO",
        precioUnidad: 0.55,
        precioConIVA: 0.60,
        grupoIVA: "R2",
        porcIVA: 10,
        porcDescuento: 0,
        importe: 0.55,
        totalLinea: 0.60,
        moneda: "EUR",
        codigoAlmacen: "01",
        direccionDeEntrega: "Av. de la Libertad 12, Madrid, España",
        pickStatus: 2,
        pickStatusEx: "N",
        codigoVendedor: 3,
        estadoLinea: 1,
        incidenciaLinea: null,
      },
    ],
  };

  const pedidoTercero = {
      "codigoCliente": "C0000002",
      "direccionEnvio": "C/ El Pez\r19493  Peralveche\rESPAÑA",
      "entradaDocumento": 17,
      "enviado": true,
      "estado": "ENTREGADO",
      "estadoDocumento": 1,
      "estadoPedido": 50,
      "fechaActualizacion": "2025-11-27T00:00:00",
      "fechaCreacion": "2025-11-27T00:00:00",
      "fechaDocumento": "2025-11-27T00:00:00",
      "fechaVencimiento": "2025-11-27T00:00:00",
      "importeIVA": 0.34,
      "importeTotal": 3.71,
      "incidenciaDocumento": "",
      "lineasPedidoCliente": [
        {
          "cantidad": 1,
          "cantidadPaquetes": 1,
          "codigoAlmacen": "03",
          "codigoProducto": "6031",
          "codigoUnidadMedida": "Manual",
          "codigoVendedor": 0,
          "descripcion": "MARGARINA LIGERESA 250 GRS",
          "direccionDeEntrega": "C/ El Pez\r19493  Peralveche\rESPAÑA",
          "elementosPorUnidad": 1,
          "estado": "ABIERTO",
          "fechaEnvio": "2025-11-27T00:00:00",
          "grupoIVA": "R2",
          "idLineaAlbaran": "1-0",
          "importe": 1.909,
          "moneda": "EUR",
          "nombreUnidadMedida": "Unidad",
          "numeroLinea": 0,
          "pickStatus": false,
          "pickStatusEx": "N",
          "porcDescuento": 0,
          "porcIVA": 10,
          "precioConIVA": 2.1,
          "precioUnidad": 1.909,
          "totalLinea": 1.91,
          "unidadMedida": -1
        },
        {
          "cantidad": 1,
          "cantidadPaquetes": 1,
          "codigoAlmacen": "03",
          "codigoProducto": "9381",
          "codigoUnidadMedida": "Manual",
          "codigoVendedor": 0,
          "descripcion": "PANECILLOS TOSTADOS CON TOMATE 160 GR ALTEZA",
          "direccionDeEntrega": "C/ El Pez\r19493  Peralveche\rESPAÑA",
          "elementosPorUnidad": 1,
          "estado": "ABIERTO",
          "fechaEnvio": "2025-11-27T00:00:00",
          "grupoIVA": "R2",
          "idLineaAlbaran": "1-1",
          "importe": 1.455,
          "moneda": "EUR",
          "nombreUnidadMedida": "Unidad",
          "numeroLinea": 1,
          "pickStatus": false,
          "pickStatusEx": "N",
          "porcDescuento": 0,
          "porcIVA": 10,
          "precioConIVA": 1.6,
          "precioUnidad": 1.455,
          "totalLinea": 1.46,
          "unidadMedida": -1
        }
      ],
      "metodoPago": "Bizum",
      "nombreCliente": "Pedro Martínez",
      "numeroDocumento": 1,
      "pick": false,
      "pickStatus": false,
      "porcDescuento": 0
    }

  await insertPedido(pedidoCerrado);
  await insertPedido(pedidoAbierto);
  await insertPedido(pedidoTercero);

  console.log("✅ Seed completado: 1 pedido cerrado y 1 pedido abierto insertados");
}

