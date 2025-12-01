# ✅ Actualización: Convenios Colectivos Completados

## 🎉 ¿Qué se agregó?

### 30 Convenios Colectivos Completos
Se agregaron **30 convenios colectivos** comunes en Argentina, cada uno con sus respectivas categorías y sueldos básicos.

### Nueva Página: "Convenios"
Ahora puedes ver todos los convenios disponibles:
- Ve al menú → **"Convenios"**
- Haz clic en cualquier convenio para ver sus categorías
- Verás códigos, nombres y sueldos básicos

## 📋 Convenios Agregados

### Ya existían (4):
1. Textil
2. Comercio
3. Metalúrgico
4. Administrativo

### Nuevos (26):
5. Construcción
6. Gastronomía
7. Transporte
8. Seguridad
9. Educación
10. Salud
11. Bancario
12. Seguros
13. Petrolero
14. Químico
15. Gráfico
16. Alimentación
17. Farmacéutico
18. Automotriz
19. Calzado
20. Maquinista
21. Electricidad
22. Plástico
23. Madera
24. Vidrio
25. Cerámica
26. Cemento
27. Papel
28. Caucho
29. Minería
30. Agrícola

## 🔄 Para Aplicar los Cambios

### Opción 1: Reinicializar Base de Datos (Recomendado)
```bash
npm run reset-db
```

Esto:
- Crea un backup de tu base de datos actual
- Elimina la base de datos
- Crea una nueva con todos los convenios

### Opción 2: Eliminar y Reiniciar Manualmente
```bash
# Detener el servidor primero
rm server/data/liquidacion.db
# Reiniciar el servidor
npm run dev
```

## ✅ Verificación

1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Abre el navegador:**
   - Ve a: http://localhost:3000
   - Haz clic en "Convenios" en el menú

3. **Verifica:**
   - Deberías ver 30 convenios
   - Cada uno expandible para ver sus categorías

## 📖 Documentación

- **LISTA-CONVENIOS.md** - Lista completa de todos los convenios
- **CONVENIOS.md** - Guía de convenios (actualizada)
- **Página "Convenios"** - Vista interactiva en el sistema

## ⚠️ Notas Importantes

1. **Backup automático:** El script de reinicialización crea un backup automáticamente
2. **Valores de ejemplo:** Los sueldos básicos son ejemplos, deben actualizarse
3. **Datos existentes:** Si tienes empleados/liquidaciones, haz backup antes de reinicializar

## 🎯 Próximos Pasos

1. Reinicializa la base de datos (opcional, si quieres los nuevos convenios)
2. Ve a la página "Convenios" para explorar
3. Actualiza los valores según convenios vigentes
4. Comienza a usar los convenios al crear empleados

---

**¡Listo!** Ahora tienes 30 convenios disponibles en el sistema. 🚀

