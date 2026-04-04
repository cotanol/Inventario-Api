import { TipoPermiso } from '../generated/prisma/client';
import { ValidPermissions } from '../src/auth/interfaces/valid-permissions.interface';

interface SeedUsuario {
  usuarioId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  celular?: string;
  correoElectronico: string;
  clave: string;
}

interface SeedPerfil {
  perfilId: number;
  nombre: string;
  descripcion?: string;
}

interface SeedPermiso {
  permisoId: number;
  nombre: string;
  tipoPermiso: TipoPermiso;
  keyPermiso: string;
  urlMenu?: string;
  descripcion?: string;
  permisoPadreId?: number;
}

interface SeedPermisoPerfil {
  permisoId: number;
  perfilId: number;
  orden: number;
}

interface SeedUsuarioPerfil {
  usuarioId: number;
  perfilId: number;
}

interface SeedData {
  usuarios: SeedUsuario[];
  perfiles: SeedPerfil[];
  permisos: SeedPermiso[];
  permisosPerfiles: SeedPermisoPerfil[];
  usuariosPerfiles: SeedUsuarioPerfil[];
}

// === IDs USUARIOS ===
const user1Id = 1; // Admin
const user2Id = 2; // Vendedor

// === IDs PERFILES ===
const perfilAdminId = 1;
const perfilVendedorId = 2;

// === IDs PERMISOS - MENÚS PRINCIPALES ===
const menuUsuariosId = 1;
const menuProductosId = 2;
const menuClientesId = 3;
const menuMarcasId = 4;
const menuLineasId = 5;
const menuGruposId = 6;
const menuPerfilesId = 7;
const menuVendedoresId = 8;

// === IDs PERMISOS - ACCIONES DE USUARIOS ===
const verUsuariosId = 9;
const crearUsuarioId = 10;
const editarUsuarioId = 11;
const eliminarUsuarioId = 12;

// === IDs PERMISOS - ACCIONES DE PRODUCTOS ===
const verProductosId = 13;
const crearProductoId = 14;
const editarProductoId = 15;
const eliminarProductoId = 16;

// === IDs PERMISOS - ACCIONES DE CLIENTES ===
const verClientesId = 17;
const crearClienteId = 18;
const editarClienteId = 19;
const eliminarClienteId = 20;

// === IDs PERMISOS - ACCIONES DE MARCAS ===
const verMarcasId = 21;
const crearMarcaId = 22;
const editarMarcaId = 23;
const eliminarMarcaId = 24;

// === IDs PERMISOS - ACCIONES DE LÍNEAS ===
const verLineasId = 25;
const crearLineaId = 26;
const editarLineaId = 27;
const eliminarLineaId = 28;

// === IDs PERMISOS - ACCIONES DE GRUPOS ===
const verGruposId = 29;
const crearGrupoId = 30;
const editarGrupoId = 31;
const eliminarGrupoId = 32;

// === IDs PERMISOS - ACCIONES DE PERFILES ===
const verPerfilesId = 33;
const crearPerfilId = 34;
const editarPerfilId = 35;
const eliminarPerfilId = 36;

// === IDs PERMISOS - ACCIONES DE VENDEDORES ===
const verVendedoresId = 37;
const crearVendedorId = 38;
const editarVendedorId = 39;
const eliminarVendedorId = 40;

// === IDs PERMISOS - MENÚS NUEVOS ===
const menuProveedoresId = 41;
const menuComprasId = 42;
const menuPedidosId = 43;

// === IDs PERMISOS - ACCIONES DE PROVEEDORES ===
const verProveedoresId = 44;
const crearProveedorId = 45;
const editarProveedorId = 46;
const eliminarProveedorId = 47;

// === IDs PERMISOS - ACCIONES DE COMPRAS ===
const verComprasId = 48;
const crearCompraId = 49;
const editarCompraId = 50;
const eliminarCompraId = 51;

// === IDs PERMISOS - ACCIONES DE PEDIDOS ===
const verPedidosId = 52;
const crearPedidoId = 53;
const editarPedidoId = 54;
const eliminarPedidoId = 55;

export const initialData: SeedData = {
  usuarios: [
    {
      usuarioId: user1Id,
      nombres: 'Carlos',
      apellidoPaterno: 'Rodriguez',
      correoElectronico: 'admin@dym.com',
      clave: 'admin@123A',
    },
    {
      usuarioId: user2Id,
      nombres: 'Maria',
      apellidoPaterno: 'Gonzalez',
      apellidoMaterno: 'Lopez',
      celular: '987654321',
      correoElectronico: 'vendedor@dym.com',
      clave: 'vendedor@123A',
    },
  ],
  perfiles: [
    {
      perfilId: perfilAdminId,
      nombre: 'administrador',
      descripcion: 'Acceso total al sistema',
    },
    {
      perfilId: perfilVendedorId,
      nombre: 'vendedor',
      descripcion: 'Acceso solo a gestión de clientes',
    },
  ],
  permisos: [
    // ========== MENÚS PRINCIPALES ==========
    {
      permisoId: menuUsuariosId,
      keyPermiso: 'MENU_USUARIOS',
      nombre: 'Usuarios',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/usuarios',
      descripcion: 'Gestión de usuarios del sistema',
    },
    {
      permisoId: menuProductosId,
      keyPermiso: 'MENU_PRODUCTOS',
      nombre: 'Productos',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/productos',
      descripcion: 'Gestión de productos',
    },
    {
      permisoId: menuClientesId,
      keyPermiso: 'MENU_CLIENTES',
      nombre: 'Clientes',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/clientes',
      descripcion: 'Gestión de clientes',
    },
    {
      permisoId: menuMarcasId,
      keyPermiso: 'MENU_MARCAS',
      nombre: 'Marcas',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/marcas',
      descripcion: 'Gestión de marcas',
    },
    {
      permisoId: menuLineasId,
      keyPermiso: 'MENU_LINEAS',
      nombre: 'Líneas',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/lineas',
      descripcion: 'Gestión de líneas',
    },
    {
      permisoId: menuGruposId,
      keyPermiso: 'MENU_GRUPOS',
      nombre: 'Grupos',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/grupos',
      descripcion: 'Gestión de grupos',
    },
    {
      permisoId: menuPerfilesId,
      keyPermiso: 'MENU_PERFILES',
      nombre: 'Perfiles',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/perfiles',
      descripcion: 'Gestión de perfiles y permisos',
    },
    {
      permisoId: menuVendedoresId,
      keyPermiso: 'MENU_VENDEDORES',
      nombre: 'Vendedores',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/vendedores',
      descripcion: 'Gestión de vendedores',
    },

    // ========== ACCIONES DE USUARIOS ==========
    {
      permisoId: verUsuariosId,
      keyPermiso: ValidPermissions.VER_USUARIOS,
      nombre: 'Ver Usuarios',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite visualizar la lista de usuarios',
    },
    {
      permisoId: crearUsuarioId,
      keyPermiso: ValidPermissions.CREAR_USUARIO,
      nombre: 'Crear Usuario',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite crear nuevos usuarios',
    },
    {
      permisoId: editarUsuarioId,
      keyPermiso: ValidPermissions.EDITAR_USUARIO,
      nombre: 'Editar Usuario',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite modificar usuarios existentes',
    },
    {
      permisoId: eliminarUsuarioId,
      keyPermiso: ValidPermissions.ELIMINAR_USUARIO,
      nombre: 'Eliminar Usuario',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite eliminar usuarios',
    },

    // ========== ACCIONES DE PRODUCTOS ==========
    {
      permisoId: verProductosId,
      keyPermiso: ValidPermissions.VER_PRODUCTOS,
      nombre: 'Ver Productos',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite visualizar la lista de productos',
    },
    {
      permisoId: crearProductoId,
      keyPermiso: ValidPermissions.CREAR_PRODUCTO,
      nombre: 'Crear Producto',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite crear nuevos productos',
    },
    {
      permisoId: editarProductoId,
      keyPermiso: ValidPermissions.EDITAR_PRODUCTO,
      nombre: 'Editar Producto',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite modificar productos existentes',
    },
    {
      permisoId: eliminarProductoId,
      keyPermiso: ValidPermissions.ELIMINAR_PRODUCTO,
      nombre: 'Eliminar Producto',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite eliminar productos',
    },

    // ========== ACCIONES DE CLIENTES ==========
    {
      permisoId: verClientesId,
      keyPermiso: ValidPermissions.VER_CLIENTES,
      nombre: 'Ver Clientes',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite visualizar la lista de clientes',
    },
    {
      permisoId: crearClienteId,
      keyPermiso: ValidPermissions.CREAR_CLIENTE,
      nombre: 'Crear Cliente',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite crear nuevos clientes',
    },
    {
      permisoId: editarClienteId,
      keyPermiso: ValidPermissions.EDITAR_CLIENTE,
      nombre: 'Editar Cliente',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite modificar clientes existentes',
    },
    {
      permisoId: eliminarClienteId,
      keyPermiso: ValidPermissions.ELIMINAR_CLIENTE,
      nombre: 'Eliminar Cliente',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite eliminar clientes',
    },

    // ========== ACCIONES DE MARCAS ==========
    {
      permisoId: verMarcasId,
      keyPermiso: ValidPermissions.VER_MARCAS,
      nombre: 'Ver Marcas',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite visualizar la lista de marcas',
    },
    {
      permisoId: crearMarcaId,
      keyPermiso: ValidPermissions.CREAR_MARCA,
      nombre: 'Crear Marca',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite crear nuevas marcas',
    },
    {
      permisoId: editarMarcaId,
      keyPermiso: ValidPermissions.EDITAR_MARCA,
      nombre: 'Editar Marca',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite modificar marcas existentes',
    },
    {
      permisoId: eliminarMarcaId,
      keyPermiso: ValidPermissions.ELIMINAR_MARCA,
      nombre: 'Eliminar Marca',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite eliminar marcas',
    },

    // ========== ACCIONES DE LÍNEAS ==========
    {
      permisoId: verLineasId,
      keyPermiso: ValidPermissions.VER_LINEAS,
      nombre: 'Ver Líneas',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite visualizar la lista de líneas',
    },
    {
      permisoId: crearLineaId,
      keyPermiso: ValidPermissions.CREAR_LINEA,
      nombre: 'Crear Línea',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite crear nuevas líneas',
    },
    {
      permisoId: editarLineaId,
      keyPermiso: ValidPermissions.EDITAR_LINEA,
      nombre: 'Editar Línea',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite modificar líneas existentes',
    },
    {
      permisoId: eliminarLineaId,
      keyPermiso: ValidPermissions.ELIMINAR_LINEA,
      nombre: 'Eliminar Línea',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite eliminar líneas',
    },

    // ========== ACCIONES DE GRUPOS ==========
    {
      permisoId: verGruposId,
      keyPermiso: ValidPermissions.VER_GRUPOS,
      nombre: 'Ver Grupos',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite visualizar la lista de grupos',
    },
    {
      permisoId: crearGrupoId,
      keyPermiso: ValidPermissions.CREAR_GRUPO,
      nombre: 'Crear Grupo',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite crear nuevos grupos',
    },
    {
      permisoId: editarGrupoId,
      keyPermiso: ValidPermissions.EDITAR_GRUPO,
      nombre: 'Editar Grupo',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite modificar grupos existentes',
    },
    {
      permisoId: eliminarGrupoId,
      keyPermiso: ValidPermissions.ELIMINAR_GRUPO,
      nombre: 'Eliminar Grupo',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite eliminar grupos',
    },

    // ========== ACCIONES DE PERFILES ==========
    {
      permisoId: verPerfilesId,
      keyPermiso: ValidPermissions.VER_PERFILES,
      nombre: 'Ver Perfiles',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite visualizar la lista de perfiles',
    },
    {
      permisoId: crearPerfilId,
      keyPermiso: ValidPermissions.CREAR_PERFIL,
      nombre: 'Crear Perfil',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite crear nuevos perfiles',
    },
    {
      permisoId: editarPerfilId,
      keyPermiso: ValidPermissions.EDITAR_PERFIL,
      nombre: 'Editar Perfil',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite modificar perfiles existentes',
    },
    {
      permisoId: eliminarPerfilId,
      keyPermiso: ValidPermissions.ELIMINAR_PERFIL,
      nombre: 'Eliminar Perfil',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite eliminar perfiles',
    },

    // ========== ACCIONES DE VENDEDORES ==========
    {
      permisoId: verVendedoresId,
      keyPermiso: ValidPermissions.VER_VENDEDORES,
      nombre: 'Ver Vendedores',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuVendedoresId,
      descripcion: 'Permite visualizar la lista de vendedores',
    },
    {
      permisoId: crearVendedorId,
      keyPermiso: ValidPermissions.CREAR_VENDEDOR,
      nombre: 'Crear Vendedor',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuVendedoresId,
      descripcion: 'Permite crear nuevos vendedores',
    },
    {
      permisoId: editarVendedorId,
      keyPermiso: ValidPermissions.EDITAR_VENDEDOR,
      nombre: 'Editar Vendedor',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuVendedoresId,
      descripcion: 'Permite modificar vendedores existentes',
    },
    {
      permisoId: eliminarVendedorId,
      keyPermiso: ValidPermissions.ELIMINAR_VENDEDOR,
      nombre: 'Eliminar Vendedor',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuVendedoresId,
      descripcion: 'Permite eliminar vendedores',
    },

    // ========== MENÚS NUEVOS ==========
    {
      permisoId: menuProveedoresId,
      keyPermiso: 'MENU_PROVEEDORES',
      nombre: 'Proveedores',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/proveedores',
      descripcion: 'Gestión de proveedores',
    },
    {
      permisoId: menuComprasId,
      keyPermiso: 'MENU_COMPRAS',
      nombre: 'Compras',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/compras',
      descripcion: 'Gestión de compras',
    },
    {
      permisoId: menuPedidosId,
      keyPermiso: 'MENU_PEDIDOS',
      nombre: 'Pedidos',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/pedidos',
      descripcion: 'Gestión de pedidos',
    },

    // ========== ACCIONES DE PROVEEDORES ==========
    {
      permisoId: verProveedoresId,
      keyPermiso: ValidPermissions.VER_PROVEEDORES,
      nombre: 'Ver Proveedores',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProveedoresId,
      descripcion: 'Permite visualizar la lista de proveedores',
    },
    {
      permisoId: crearProveedorId,
      keyPermiso: ValidPermissions.CREAR_PROVEEDOR,
      nombre: 'Crear Proveedor',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProveedoresId,
      descripcion: 'Permite crear nuevos proveedores',
    },
    {
      permisoId: editarProveedorId,
      keyPermiso: ValidPermissions.EDITAR_PROVEEDOR,
      nombre: 'Editar Proveedor',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProveedoresId,
      descripcion: 'Permite modificar proveedores existentes',
    },
    {
      permisoId: eliminarProveedorId,
      keyPermiso: ValidPermissions.ELIMINAR_PROVEEDOR,
      nombre: 'Eliminar Proveedor',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProveedoresId,
      descripcion: 'Permite eliminar proveedores',
    },

    // ========== ACCIONES DE COMPRAS ==========
    {
      permisoId: verComprasId,
      keyPermiso: ValidPermissions.VER_COMPRAS,
      nombre: 'Ver Compras',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuComprasId,
      descripcion: 'Permite visualizar la lista de compras',
    },
    {
      permisoId: crearCompraId,
      keyPermiso: ValidPermissions.CREAR_COMPRA,
      nombre: 'Crear Compra',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuComprasId,
      descripcion: 'Permite crear nuevas compras',
    },
    {
      permisoId: editarCompraId,
      keyPermiso: ValidPermissions.EDITAR_COMPRA,
      nombre: 'Editar Compra',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuComprasId,
      descripcion: 'Permite modificar compras existentes',
    },
    {
      permisoId: eliminarCompraId,
      keyPermiso: ValidPermissions.ELIMINAR_COMPRA,
      nombre: 'Eliminar Compra',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuComprasId,
      descripcion: 'Permite eliminar compras',
    },

    // ========== ACCIONES DE PEDIDOS ==========
    {
      permisoId: verPedidosId,
      keyPermiso: ValidPermissions.VER_PEDIDOS,
      nombre: 'Ver Pedidos',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPedidosId,
      descripcion: 'Permite visualizar la lista de pedidos',
    },
    {
      permisoId: crearPedidoId,
      keyPermiso: ValidPermissions.CREAR_PEDIDO,
      nombre: 'Crear Pedido',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPedidosId,
      descripcion: 'Permite crear nuevos pedidos',
    },
    {
      permisoId: editarPedidoId,
      keyPermiso: ValidPermissions.EDITAR_PEDIDO,
      nombre: 'Editar Pedido',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPedidosId,
      descripcion: 'Permite modificar pedidos existentes',
    },
    {
      permisoId: eliminarPedidoId,
      keyPermiso: ValidPermissions.ELIMINAR_PEDIDO,
      nombre: 'Eliminar Pedido',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPedidosId,
      descripcion: 'Permite eliminar pedidos',
    },
  ],
  usuariosPerfiles: [
    { usuarioId: user1Id, perfilId: perfilAdminId },
    { usuarioId: user2Id, perfilId: perfilVendedorId },
  ],
  permisosPerfiles: [
    // ========== PERFIL ADMINISTRADOR (TODOS LOS PERMISOS) ==========
    // Menús
    { permisoId: menuUsuariosId, perfilId: perfilAdminId, orden: 10 },
    { permisoId: menuProductosId, perfilId: perfilAdminId, orden: 20 },
    { permisoId: menuClientesId, perfilId: perfilAdminId, orden: 30 },
    { permisoId: menuMarcasId, perfilId: perfilAdminId, orden: 40 },
    { permisoId: menuLineasId, perfilId: perfilAdminId, orden: 50 },
    { permisoId: menuGruposId, perfilId: perfilAdminId, orden: 60 },
    { permisoId: menuPerfilesId, perfilId: perfilAdminId, orden: 70 },
    { permisoId: menuVendedoresId, perfilId: perfilAdminId, orden: 80 },

    // Acciones de Usuarios
    { permisoId: verUsuariosId, perfilId: perfilAdminId, orden: 11 },
    { permisoId: crearUsuarioId, perfilId: perfilAdminId, orden: 12 },
    { permisoId: editarUsuarioId, perfilId: perfilAdminId, orden: 13 },
    { permisoId: eliminarUsuarioId, perfilId: perfilAdminId, orden: 14 },

    // Acciones de Productos
    { permisoId: verProductosId, perfilId: perfilAdminId, orden: 21 },
    { permisoId: crearProductoId, perfilId: perfilAdminId, orden: 22 },
    { permisoId: editarProductoId, perfilId: perfilAdminId, orden: 23 },
    { permisoId: eliminarProductoId, perfilId: perfilAdminId, orden: 24 },

    // Acciones de Clientes
    { permisoId: verClientesId, perfilId: perfilAdminId, orden: 31 },
    { permisoId: crearClienteId, perfilId: perfilAdminId, orden: 32 },
    { permisoId: editarClienteId, perfilId: perfilAdminId, orden: 33 },
    { permisoId: eliminarClienteId, perfilId: perfilAdminId, orden: 34 },

    // Acciones de Marcas
    { permisoId: verMarcasId, perfilId: perfilAdminId, orden: 41 },
    { permisoId: crearMarcaId, perfilId: perfilAdminId, orden: 42 },
    { permisoId: editarMarcaId, perfilId: perfilAdminId, orden: 43 },
    { permisoId: eliminarMarcaId, perfilId: perfilAdminId, orden: 44 },

    // Acciones de Líneas
    { permisoId: verLineasId, perfilId: perfilAdminId, orden: 51 },
    { permisoId: crearLineaId, perfilId: perfilAdminId, orden: 52 },
    { permisoId: editarLineaId, perfilId: perfilAdminId, orden: 53 },
    { permisoId: eliminarLineaId, perfilId: perfilAdminId, orden: 54 },

    // Acciones de Grupos
    { permisoId: verGruposId, perfilId: perfilAdminId, orden: 61 },
    { permisoId: crearGrupoId, perfilId: perfilAdminId, orden: 62 },
    { permisoId: editarGrupoId, perfilId: perfilAdminId, orden: 63 },
    { permisoId: eliminarGrupoId, perfilId: perfilAdminId, orden: 64 },

    // Acciones de Perfiles
    { permisoId: verPerfilesId, perfilId: perfilAdminId, orden: 71 },
    { permisoId: crearPerfilId, perfilId: perfilAdminId, orden: 72 },
    { permisoId: editarPerfilId, perfilId: perfilAdminId, orden: 73 },
    { permisoId: eliminarPerfilId, perfilId: perfilAdminId, orden: 74 },

    // Acciones de Vendedores
    { permisoId: verVendedoresId, perfilId: perfilAdminId, orden: 81 },
    { permisoId: crearVendedorId, perfilId: perfilAdminId, orden: 82 },
    { permisoId: editarVendedorId, perfilId: perfilAdminId, orden: 83 },
    { permisoId: eliminarVendedorId, perfilId: perfilAdminId, orden: 84 },

    // Menús de Proveedores, Compras, Pedidos
    { permisoId: menuProveedoresId, perfilId: perfilAdminId, orden: 90 },
    { permisoId: menuComprasId, perfilId: perfilAdminId, orden: 100 },
    { permisoId: menuPedidosId, perfilId: perfilAdminId, orden: 110 },

    // Acciones de Proveedores
    { permisoId: verProveedoresId, perfilId: perfilAdminId, orden: 91 },
    { permisoId: crearProveedorId, perfilId: perfilAdminId, orden: 92 },
    { permisoId: editarProveedorId, perfilId: perfilAdminId, orden: 93 },
    { permisoId: eliminarProveedorId, perfilId: perfilAdminId, orden: 94 },

    // Acciones de Compras
    { permisoId: verComprasId, perfilId: perfilAdminId, orden: 101 },
    { permisoId: crearCompraId, perfilId: perfilAdminId, orden: 102 },
    { permisoId: editarCompraId, perfilId: perfilAdminId, orden: 103 },
    { permisoId: eliminarCompraId, perfilId: perfilAdminId, orden: 104 },

    // Acciones de Pedidos
    { permisoId: verPedidosId, perfilId: perfilAdminId, orden: 111 },
    { permisoId: crearPedidoId, perfilId: perfilAdminId, orden: 112 },
    { permisoId: editarPedidoId, perfilId: perfilAdminId, orden: 113 },
    { permisoId: eliminarPedidoId, perfilId: perfilAdminId, orden: 114 },

    // ========== PERFIL VENDEDOR (SOLO CLIENTES) ==========
    { permisoId: menuClientesId, perfilId: perfilVendedorId, orden: 10 },
    { permisoId: verClientesId, perfilId: perfilVendedorId, orden: 11 },
    { permisoId: crearClienteId, perfilId: perfilVendedorId, orden: 12 },
    { permisoId: editarClienteId, perfilId: perfilVendedorId, orden: 13 },
    { permisoId: eliminarClienteId, perfilId: perfilVendedorId, orden: 14 },
  ],
};
