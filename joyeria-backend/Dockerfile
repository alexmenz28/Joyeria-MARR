FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["joyeria-backend/JoyeriaBackend.csproj", "joyeria-backend/"]
RUN dotnet restore "joyeria-backend/JoyeriaBackend.csproj"
COPY joyeria-backend/ joyeria-backend/
WORKDIR /src/joyeria-backend
RUN dotnet publish "JoyeriaBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "JoyeriaBackend.dll"]
