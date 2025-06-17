using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.Models
{
    public class Producto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public decimal Precio { get; set; }

        public string ImagenUrl { get; set; }

        [Required]
        public string Categoria { get; set; }

        public string Material { get; set; }

        public string Peso { get; set; }

        public bool Disponible { get; set; } = true;

        public int Stock { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
} 